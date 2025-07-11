import { Server } from "socket.io";

import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chat-app-five-navy-48.vercel.app/"],
  },
});

export const getReceiverId = (userId) => {
  return userSocketMap[userId];
};

//store online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("typing", ({ to, from }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("typing", { from });
    }
  });

  socket.on("deleteMessage", ({ messageId, senderId, receiverId }) => {
    console.log("Socket deleteMessage received:", messageId);

    const senderSocketId = userSocketMap[senderId];
    const receiverSocketId = userSocketMap[receiverId];

    if (senderSocketId === socket.id) {
      socket.emit("messageDeleted", { messageId });
    } else if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", { messageId });
    }

    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }
  });

  socket.on("updateMessage", ({ messageId, senderId, receiverId, newText }) => {
    console.log("Socket updateMessage received:", messageId, newText);

    const senderSocketId = userSocketMap[senderId];
    const receiverSocketId = userSocketMap[receiverId];

    const updatedPayload = { messageId, newText };

    if (senderSocketId) {
      io.to(senderSocketId).emit("messageUpdated", updatedPayload);
    }

    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", updatedPayload);
    }
  });

  socket.on("stopTyping", ({ to, from }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("stopTyping", { from });
    }
  });

  socket.on("messageDelivered", ({ messageId, senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      socket.to(senderSocketId).emit("messageDelivered", { messageId });
    }
  });
  socket.on("messageRead", ({ messageId, senderId }) => {
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      socket.to(senderSocketId).emit("messageRead", { messageId });
    }
  });
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
