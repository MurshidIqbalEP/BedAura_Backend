import mongoose, { Model, Schema, Document } from "mongoose";
import IConversation from "../../domain/conversation";

const conversationSchema = new Schema<IConversation>({
  senderId:{
    type:Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  receiverId:{
    type:Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  message:{
    type:String,
    required:true
  }
  
}, {
  timestamps: true,
});

// Create and export the Booking model
const ConversationModel: Model<IConversation> = mongoose.model<IConversation>('Conversation', conversationSchema);

export default ConversationModel;
