import { Server } from "socket.io";
import { Call } from "../models/call.model.js";

export const onlineUsers = new Map();
export const ongoingCalls = new Map();

let io;
export const getIO = () => io;

export const socketInit = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("typing", ({ chatId, sender }) => {
      socket.to(chatId).emit("typing", sender);
    });

    socket.on("stop typing", ({ chatId }) => {
      socket.to(chatId).emit("stop typing");
    });

    socket.on("join chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("messages seen", ({ chatId, seenBy }) => {
      socket.to(chatId).emit("messages seen", { chatId, seenBy });
    });


    socket.on("callUser", async ({ userToCall, signalData, from, callType, chatId, isGroupCall = false }) => {
      try {
 
        const newCall = await Call.create({
          caller: from,
          receiver: userToCall,
          chat: chatId,
          type: callType,
          status: "initiated",
          isGroupCall,
          signalingData: {},
          startedAt: null,
          endedAt: null,
          duration: 0,
        });

        ongoingCalls.set(newCall._id.toString(), {
          caller: from,
          receiver: userToCall,
          status: "initiated",
          socketCallerId: socket.id,
          socketReceiverId: onlineUsers.get(userToCall),
          callType,
          chatId,
          isGroupCall,
        });

        const userSocket = onlineUsers.get(userToCall);
        console.log(userSocket)
        if (userSocket) {
          console.log("incomingCall")
          io.to(userSocket).emit("incomingCall", {
            from,
            callId: newCall._id.toString(),
            signalData,
            callType,
            chatId,
            isGroupCall,
          });
        }

        io.to(onlineUsers.get(from)).emit("callStarted", {
          from,
          callId: newCall._id.toString(),
          signalData,
          callType,
          chatId,
          isGroupCall,
        });
      } catch (error) {
        console.error("Error creating call:", error);
        io.to(socket.id).emit("callError", { message: "Failed to start call." });
      }
    });

    socket.on("answerCall", async ({ callId, signal }) => {
      try {
        console.log("answercall")
        const call = ongoingCalls.get(callId);

        if (!call) return;

        await Call.findByIdAndUpdate(callId, {
          status: "answered",
          startedAt: new Date(),
        });

        ongoingCalls.set(callId, { ...call, status: "answered" });

        if (call.socketCallerId) {
          io.to(call.socketCallerId).emit("callAccepted", { callId, signal });
        }
      } catch (error) {
        console.error("Error answering call:", error);
      }
    });

    socket.on("rejectCall", async ({ callId }) => {
      try {
        console.log("rejectCall")
        const call = ongoingCalls.get(callId);
        if (!call) return;

        await Call.findByIdAndUpdate(callId, { status: "rejected", endedAt: new Date() });

        ongoingCalls.delete(callId);

        if (call.socketCallerId) {
          io.to(call.socketCallerId).emit("callRejected", { callId });
        }
      } catch (error) {
        console.error("Error rejecting call:", error);
      }
    });

    socket.on("endCall", async ({ callId }) => {
      try {
        const call = ongoingCalls.get(callId);
        if (!call) return;

        const endedAt = new Date();

        const callDoc = await Call.findById(callId);
        const duration = callDoc?.startedAt ? Math.floor((endedAt - callDoc.startedAt) / 1000) : 0;

        await Call.findByIdAndUpdate(callId, {
          status: "ended",
          endedAt,
          duration,
        });

        ongoingCalls.delete(callId);
        if (call.socketCallerId) {
          io.to(call.socketCallerId).emit("callEnded", { callId });
        }
        if (call.socketReceiverId) {
          io.to(call.socketReceiverId).emit("callEnded", { callId });
        }
      } catch (error) {
        console.error("Error ending call:", error);
      }
    });

  socket.on("signal", ({ callId, signal }) => {
  const call = ongoingCalls.get(callId);

  if (!call) {
    console.log("[Server] No such call in ongoingCalls");
    return;
  }

  const toSocketId =
    socket.id === call.socketCallerId ? call.socketReceiverId : call.socketCallerId;

  if (toSocketId) {
    io.to(toSocketId).emit("signal", { callId, signal });
  } else {
    console.log("[Server] Unable to find toSocketId");
  }
});


    socket.on("disconnect", async () => {
      if (!socket.userId) return;

      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));

      for (const [callId, call] of ongoingCalls.entries()) {
        if (call.caller === socket.userId || call.receiver === socket.userId) {
          try {
            const endedAt = new Date();

            const callDoc = await Call.findById(callId);
            const duration = callDoc?.startedAt ? Math.floor((endedAt - callDoc.startedAt) / 1000) : 0;

            await Call.findByIdAndUpdate(callId, {
              status: "ended",
              endedAt,
              duration,
            });

            ongoingCalls.delete(callId);

            const otherSocketId =
              call.caller === socket.userId ? call.socketReceiverId : call.socketCallerId;
            if (otherSocketId) {
              io.to(otherSocketId).emit("callEnded", {
                callId,
                reason: "user disconnected",
              });
            }
          } catch (error) {
            console.error("Error handling disconnect call cleanup:", error);
          }
        }
      }

    });
  });
};
