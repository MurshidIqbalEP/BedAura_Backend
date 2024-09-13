import { Types } from "mongoose";
import User from "./user";
interface Message{
    senderId:Types.ObjectId;
    users:Types.ObjectId[];
    message:string;
    date:Date;
 }
 
 export default Message;