import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import session, { SessionOptions } from "express-session";
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io"; // Import socket.io server
import UserModel from "../database/userModel";

// route roots
import { userRoute } from "../router/userRoute";
import { adminRoute } from "../router/adminRoute";
import path from "path";

const app = express();
export const httpServer = http.createServer(app);

// Initialize Socket.IO and attach it to the server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../../../uploads"))
);

app.use(
  cors({
    origin: process.env.CORS_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

const sessionOptions: SessionOptions = {
  secret: process.env.SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000,
  },
};

app.use(session(sessionOptions));

app.use(morgan("dev"));

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

const userSockets: { [key: string]: string } = {}; // Maps userId to socketId
const onlineUsers: { [key: string]: boolean } = {}; // Track user online status

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user and mark them online
  socket.on("registerUser", (userId) => {
    userSockets[userId] = socket.id; // Store the socket ID associated with the user ID
    onlineUsers[userId] = true; // Mark user as online
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
   
    // Notify all clients that this user is online
    io.emit("userOnlineStatus", { userId, online: true });
  });

  // User joins a room
  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const room = getRoomId(senderId, receiverId);
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Sending a message
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const room = getRoomId(senderId, receiverId);
    const sender = await getSender(senderId);
    const messageData = { sender, senderId, receiverId, message, room };

    console.log(
      `Message from ${senderId} to ${receiverId} in room ${room}: ${message}`
    );

    const receiverSocketId = userSockets[receiverId]; // Get the socket ID of the receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData); // Send the message to the specific user
    }
  });

  // Video call event
  socket.on("videoCall", async ({ senderId, receiverId, roomId }) => {
    console.log("Video call emitted", senderId);

    const room = getRoomId(senderId, receiverId);
    const sender = await getSender(senderId);

    const receiverSocketId = userSockets[receiverId]; // Get the socket ID of the receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveVideoCall", {
        sender,
        senderId,
        roomId,
      }); // Send the video call notification to the receiver
    }
  });

  socket.on("checkStatus", ({ chattingWithUserId }) => {
    let status = onlineUsers[chattingWithUserId];
    console.log(onlineUsers);
    
    socket.emit("onlineStatus", { status });
  });
  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Find and remove the user from the mapping
    let disconnectedUserId = null;
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        disconnectedUserId = userId;
        delete userSockets[userId];
        break;
      }
    }

    if (disconnectedUserId) {
      // Mark user as offline
      onlineUsers[disconnectedUserId] = false;

      // Notify all clients that this user is offline
      io.emit("userOnlineStatus", {
        userId: disconnectedUserId,
        online: false,
      });
    }
  });
});

// Utility functions
function getRoomId(user1: string, user2: string) {
  return [user1, user2].sort().join("_");
}

async function getSender(senderId: string) {
  const user = await UserModel.findById(senderId);
  return user?.name;
}
