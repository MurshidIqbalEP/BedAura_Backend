import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import session, { SessionOptions } from 'express-session'
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io";   // Import socket.io server

// route roots
import {userRoute} from "../router/userRoute";
import { adminRoute } from "../router/adminRoute";
import path from "path";


const app = express()
export const httpServer = http.createServer(app)


// Initialize Socket.IO and attach it to the server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_URL,  
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../../../uploads')));
console.log(path.resolve(__dirname, '../../../uploads'));

app.use(cors({
  origin: process.env.CORS_URL,
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

const sessionOptions: SessionOptions = {
  secret: process.env.SECRET as string , 
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,
      maxAge: 3600000,
    },
};

app.use(session(sessionOptions));

app.use(morgan('dev'))   

app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)


// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const room = getRoomId(senderId, receiverId);
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const room = getRoomId(senderId, receiverId);
    const messageData = { senderId, receiverId, message, room };
    console.log(`Message from ${senderId} to ${receiverId} in room ${room}: ${message}`);
    io.to(room).emit('receiveMessage', messageData);
  });

  socket.on("videoCall", ({ senderId, receiverId, roomId }) => {
    console.log(" video call emitted",senderId);
    
    const room = getRoomId(senderId, receiverId);
    io.to(room).emit("receiveVideoCall", { senderId, roomId });
    
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



function getRoomId(user1 : string, user2 : string) {
  return [user1, user2].sort().join('_'); 
}

