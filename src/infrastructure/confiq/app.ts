import express from "express";
import cors from "cors";
import dotenv, { config } from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import session from 'express-session'
import morgan from "morgan";
import http from "http";


// route roots
import {userRoute} from "../../infrastructure/router/userRoute";
// import tutorRoute from "../router/toturRoute";
// import adminRoute from "../router/adminRoute";

const app = express()
export const httpServer = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

app.use(session({
    secret: process.env.SECRET as string ,  
    resave: false,              
    saveUninitialized: true,    
  }));

  app.use(cors({
    origin: process.env.CORS_URL,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'))   

app.use("/api/user", userRoute)
// app.use("/api/admin", adminRoute)
// app.use("/api/franchise", franchiseRoute)
// app.use("/api/messages", messagesRoute)


