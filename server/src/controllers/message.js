import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { getIO, onlineUsers } from "../socket/server.js";
import { Message } from "../models/message.model.js";



export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type, fileUrl, repliedTo } = req.body;
    const senderId = req.user._id;

     if (!chatId || !senderId) {
       return res.status(400).json({ message: "Invalid data" });
     }

    const msg = {
      chat:chatId,
      sender : senderId,
      content,
      type,
      fileUrl:req.file ? req.file.path : "",
      repliedTo,
      seenBy:[senderId]
    }

    const newMessage = await Message.create(msg);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    const populatedMessage = await newMessage.populate([
      { path: "sender", select: "username avatar" },
      { path: "chat" },
      {
        path: "repliedTo",
        populate: { path: "sender", select: "username avatar" },
      },
    ]);
    const chat = populatedMessage.chat;
    const io = getIO();
    if (io && chat?.participants?.length > 0) {
      chat.participants.forEach((userId) => {
        if (userId.toString() !== senderId.toString()) {
          const recipientSocketId = onlineUsers.get(userId.toString());
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("message received", populatedMessage);
          }
        }
      });
    }
    res.status(201).json({ message: "Message sent", data: populatedMessage });

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMessages = asyncHandler(async (req,res) => {
  const {chatId} = req.params

  if(!chatId){
    throw new ApiError(400,"No chat ID proviced.")
  }

  const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email avatar") 
      .populate("repliedTo") 
      .populate("seenBy", "username email avatar")
      .sort({ createdAt: 1 })

  
  return res.status(200).json(new ApiResponse(200,messages,"Successfully messages fetched."))
})


export const markMessagesAsSeen = asyncHandler(async (req,res) => {

  const {chatId} = req.body

  const userId = req.user._id

  if(!chatId){
    throw new ApiError(400,"Chat ID is required" )
  }

  const unSeenMessages = await Message.updateMany(
    {chat:chatId,
      seenBy:{$ne:userId}
    },
    {
      $addToSet:{seenBy: userId }
    }
  )
  

  return res.status(200).json(new ApiResponse(200,{seenBy:[userId]},"Messages marked as seen"))

})





export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;
console.log(req.params)

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this message");
  }

  await message.deleteOne();

  const chat = await Chat.findById(message.chat);
  const io = getIO();
  if (io && chat?.participants?.length > 0) {
    chat.participants.forEach((participantId) => {
      const socketId = onlineUsers.get(participantId.toString());
      if (socketId) {
        io.to(socketId).emit("message deleted", { messageId, chatId: chat._id });
      }
    });
  }

  return res.status(200).json(new ApiResponse(200, { messageId }, "Message deleted"));
});
