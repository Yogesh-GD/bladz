import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file"],
    default: "text"
  },
  fileUrl: {
    type: String,
    default: ""
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  repliedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },
  reactions: [{
    emoji: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }]
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
