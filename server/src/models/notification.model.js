import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: {
    type: String,
    enum: ["message", "call", "group-invite", "mention", "custom"],
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  relatedChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  relatedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
