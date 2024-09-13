import mongoose, { Model, Schema, Document } from "mongoose";
import IMessage from "../../domain/message";

const messageSchema = new Schema<IMessage>({
  senderId:{
    type:Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  users:[
    {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  ],
  message:{
    type:String,
    required:true
  }
  
}, {
  timestamps: true,
});

// Create and export the Booking model
const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default MessageModel;
