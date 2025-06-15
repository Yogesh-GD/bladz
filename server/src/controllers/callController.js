import { Call } from "../models/call.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getIO, onlineUsers } from "../socket/server.js";

export const initiateCall = asyncHandler(async (req, res) => {
  const { receiverId, chatId, type, isGroupCall = false } = req.body;
  const callerId = req.user._id;

  if (!receiverId || !type) {
    throw new ApiError(400, "receiverId and call type are required");
  }

  // Create call record
  const call = await Call.create({
    caller: callerId,
    receiver: receiverId,
    chat: chatId,
    type,
    status: "initiated",
    isGroupCall,
  });

  // Notify receiver(s) with socket
  const io = getIO();
  if (io) {
    if (isGroupCall) {
      // For group call, notify all participants except caller
      const chatParticipants = call.chat?.participants || [];
      chatParticipants.forEach((userId) => {
        if (userId.toString() !== callerId.toString()) {
          const socketId = onlineUsers.get(userId.toString());
          if (socketId) io.to(socketId).emit("call:incoming", call);
        }
      });
    } else {
      // One-to-one call notification
      const socketId = onlineUsers.get(receiverId.toString());
      if (socketId) io.to(socketId).emit("call:incoming", call);
    }
  }

  res.status(201).json(new ApiResponse(201, call, "Call initiated"));
});

export const updateCallStatus = asyncHandler(async (req, res) => {
  const { callId, status, signalingData } = req.body;
  const userId = req.user._id;

  if (!callId || !status) {
    throw new ApiError(400, "callId and status are required");
  }

  const call = await Call.findById(callId);
  if (!call) throw new ApiError(404, "Call not found");

  if (![call.caller.toString(), call.receiver.toString()].includes(userId.toString())) {
    throw new ApiError(403, "Not authorized to update this call");
  }

  call.status = status;

  if (status === "answered") {
    call.startedAt = call.startedAt || new Date();
  } else if (status === "ended") {
    call.endedAt = new Date();
    if (call.startedAt) {
      call.duration = Math.floor((call.endedAt - call.startedAt) / 1000); // seconds
    }
  }

  if (signalingData) {
    call.signalingData = signalingData;
  }

  await call.save();

  const io = getIO();
  if (io) {
    [call.caller.toString(), call.receiver.toString()].forEach((participantId) => {
      const socketId = onlineUsers.get(participantId);
      if (socketId) {
        io.to(socketId).emit("call:statusUpdate", call);
      }
    });
  }

  res.status(200).json(new ApiResponse(200, call, "Call status updated"));
});

export const getCallDetails = asyncHandler(async (req, res) => {
  const { callId } = req.params;

  if (!callId) {
    throw new ApiError(400, "Call ID is required");
  }

  const call = await Call.findById(callId)
    .populate("caller", "username avatar")
    .populate("receiver", "username avatar")
    .populate("chat", "participants");

  if (!call) throw new ApiError(404, "Call not found");

  res.status(200).json(new ApiResponse(200, call, "Call details fetched"));
});

export const cancelCall = asyncHandler(async (req, res) => {
  const { callId } = req.body;
  const userId = req.user._id;

  if (!callId) {
    throw new ApiError(400, "Call ID is required");
  }

  const call = await Call.findById(callId);
  if (!call) throw new ApiError(404, "Call not found");

  if (call.caller.toString() !== userId.toString()) {
    throw new ApiError(403, "Only caller can cancel the call");
  }

  if (call.status !== "initiated") {
    throw new ApiError(400, "Only calls in initiated state can be cancelled");
  }

  call.status = "missed";
  await call.save();

  const io = getIO();
  if (io) {
    const socketId = onlineUsers.get(call.receiver.toString());
    if (socketId) io.to(socketId).emit("call:cancelled", call);
  }

  res.status(200).json(new ApiResponse(200, call, "Call cancelled"));
});

export const getCallHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20 } = req.query;

  const calls = await Call.find({
    $or: [{ caller: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("caller", "username avatar")
    .populate("receiver", "username avatar")
    .populate("chat", "participants");

  const totalCalls = await Call.countDocuments({
    $or: [{ caller: userId }, { receiver: userId }],
  });

  res.status(200).json(
    new ApiResponse(200, {
      calls,
      page: Number(page),
      totalPages: Math.ceil(totalCalls / limit),
      totalCalls,
    }, "Call history fetched")
  );
});




