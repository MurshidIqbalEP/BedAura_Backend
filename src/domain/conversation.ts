import { Types } from "mongoose";
import User from "./user";

interface Conversation{
    senderId:User; 
    receiverId:User; 
    message:string;
    createdAt?: Date; 
  updatedAt?: Date;
 }
 
 export default Conversation;