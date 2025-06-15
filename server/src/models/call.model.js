import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
    default: null,
  },
  
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.isGroupCall;
    },
  }],
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    index: true,
    required: false,
  },
  type: {
    type: String,
    enum: ["audio", "video"],
    required: true,
  },
  status: {
    type: String,
    enum: ["initiated", "ringing", "answered", "missed", "rejected", "ended"],
    default: "initiated",
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 0,
  },
  signalingData: {
    type: Object,
    default: {},
   
  },
  isGroupCall: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

callSchema.virtual('computedDuration').get(function () {
  if (this.startedAt && this.endedAt) {
    return Math.floor((this.endedAt - this.startedAt) / 1000); 
  }
  return 0;
});

export const Call = mongoose.model("Call", callSchema);
