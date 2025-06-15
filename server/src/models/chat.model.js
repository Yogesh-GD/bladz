import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Message } from "./message.model.js";

const chatSchema = new mongoose.Schema({
  isGroupChat: {
    type: Boolean,
    default: false
  },
  chatName: {
    type: String,
    trim: true,
    default: "Direct Chat"
  },
  chatImage: {
    type: String,
    default: ""
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  isMuted: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  pinnedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

export const Chat =  mongoose.model("Chat", chatSchema);
