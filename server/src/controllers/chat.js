import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";


export const getAllChats = asyncHandler(async (req,res) => {
    const userId = req.user._id

    const chats = await Chat.find({participants:userId})
                    .populate("participants"," -password ")
                    .populate("groupAdmin"," -password ")
                    .populate({
                        path:"latestMessage",
                        populate : {
                            path : "sender",
                            select : "username email"
                        }
                    })
                    .sort({updatedAt: -1})

    return res.status(200).json(new ApiResponse(200,chats,"SuccessFully chats fetched."))
})


export const accessChat = asyncHandler( async (req,res) => {
    const { userId } = req.body;
    if (!userId) {
        throw new ApiError(200,"User ID is required")
    }

    const isChatExists = await Chat.findOne({
        isGroupChat:false,
        participants:{$all:[req.user._id,userId],$size:2}
    })
        .populate("participants","-password")
        .populate("latestMessage")

    if(isChatExists){
        return res.status(200).json( new ApiResponse(200,isChatExists,"Successfully chat accessed."))
    }

    const newChat = await Chat.create({
        chatName:"Direct Chat",
        isGroupChat:false,
        participants:[req.user._id,userId]
    })

    const fullChat = await Chat.findById(newChat._id).populate("participants", "-password");
    return res.status(200).json( new ApiResponse(200,fullChat,"Successfully chat accessed."))

})

export const getSingleChat = asyncHandler(async (req,res) => {
    const { chatId  }  = req.params
    
  if (!chatId) {
    throw new ApiError(400, 'Chat ID is required');
  }

  const chat = await Chat.findById(chatId)
                            .populate('participants','-password -refreshToken')
                            .populate({
                                path:"latestMessage",
                                populate:{path:'sender',select:"username email avatar"}
                            })

    if (!chat) {
    throw new ApiError(404, 'Chat not found');
  }

  const isParticipant = chat.participants.some(
    (p) => p._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, 'Access denied. You are not a participant of this chat.');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, 'Successfully fetched the chat.'));
})



export const createGroupChat = asyncHandler(async (req,res) => {
    const { name, participants } = req.body;
  if (!name || !participants) {
    throw new ApiError(400, "Group name and participants are required");
  }

  let parsedParticipants;
  try {
    parsedParticipants = JSON.parse(participants);
  } catch (err) {
    throw new ApiError(400, "Participants must be a valid JSON array");
  }

  if (!Array.isArray(parsedParticipants) || parsedParticipants.length < 2) {
    throw new ApiError(400, "At least 2 users are required to create a group");
  }

  const allParticipants = [...parsedParticipants, req.user._id];

  const newGroup = await Chat.create({
    chatName: name,
    isGroupChat: true,
    participants: allParticipants,
    groupAdmin: req.user._id,
    chatImage: req.file ? req.file.path : '',
  });

  const populatedGroup = await Chat.findById(newGroup._id)
    .populate('participants', 'username avatar email')
    .populate('groupAdmin', 'username avatar email');

  return res.status(201).json(new ApiResponse(201, populatedGroup, "Group created successfully"));
})





export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    throw new ApiError(400, "Chat ID is required");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "Access denied. You are not a participant of this chat.");
  }

  await Message.deleteMany({ chat: chat._id });

  await Chat.findByIdAndDelete(chat._id);

  return res.status(200).json(new ApiResponse(200, null, "Chat and all associated messages deleted successfully."));
});

export const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    throw new ApiError(400, "Chat ID is required");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Group chat not found");
  }

  if (!chat.isGroupChat) {
    throw new ApiError(400, "This chat is not a group chat");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant of this group chat.");
  }

  chat.participants = chat.participants.filter(
    (p) => p.toString() !== req.user._id.toString()
  );

  if (chat.groupAdmin.toString() === req.user._id.toString()) {
    chat.groupAdmin = chat.participants.length > 0 ? chat.participants[0] : null;
  }

  await chat.save();

  return res.status(200).json(new ApiResponse(200, chat, "You have left the group chat successfully."));
});




export const addUserToGroup = asyncHandler(async (req, res) => {
  const { users } = req.body; 
  const { chatId } = req.params;

  if (!chatId || !users || !Array.isArray(users) || users.length === 0) {
    throw new ApiError(400, "Chat ID and an array of user IDs to add are required");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Group chat not found");
  }

  if (!chat.isGroupChat) {
    throw new ApiError(400, "Cannot add users to a non-group chat");
  }

  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only group admin can add users");
  }

  const newUsersToAdd = users.filter(userId => !chat.participants.includes(userId));

  if (newUsersToAdd.length === 0) {
    throw new ApiError(400, "All users are already participants");
  }

  chat.participants.push(...newUsersToAdd);

  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("participants", "username avatar email")
    .populate("groupAdmin", "username avatar email");

  return res.status(200).json(new ApiResponse(200, updatedChat, "Users added to group successfully"));
});




export const removeUserFromGroup = asyncHandler(async (req, res) => {

  const { chatId } = req.params;
  const { memberId:userId } = req.body;

  if (!chatId || !userId) {
    throw new ApiError(400, "Chat ID and user ID are required");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Group chat not found");
  }

  if (!chat.isGroupChat) {
    throw new ApiError(400, "This chat is not a group chat");
  }

  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only group admin can remove users");
  }

  if (chat.groupAdmin.toString() === userId.toString()) {
    throw new ApiError(400, "Group admin cannot remove themselves");
  }
console.log(69)
  const isParticipant = chat.participants.some(
    (p) => p.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(404, "User is not a participant of this group");
  }

  chat.participants = chat.participants.filter(
    (p) => p.toString() !== userId.toString()
  );

  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("participants", "username avatar email")
    .populate("groupAdmin", "username avatar email");

  return res.status(200).json(new ApiResponse(200, updatedChat, "User removed from group successfully"));
});
