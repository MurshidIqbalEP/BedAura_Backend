import { Types } from "mongoose";
import User from "./user";
interface Message{
    senderId:Types.ObjectId;
    users:Types.ObjectId[];
    message:string;
    createdAt:Date;
 }
 
 export default Message;