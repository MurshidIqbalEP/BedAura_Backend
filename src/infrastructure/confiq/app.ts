import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import session, { SessionOptions } from 'express-session'
import morgan from "morgan";
import http from "http";


// route roots
import {userRoute} from "../router/userRoute";
import { adminRoute } from "../router/adminRoute";
import path from "path";


const app = express()
export const httpServer = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../../../uploads')));
console.log(path.resolve(__dirname, '../../../uploads'));

app.use(cors({
  origin: process.env.CORS_URL,
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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



