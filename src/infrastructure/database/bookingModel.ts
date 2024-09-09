import mongoose, { Model, Schema, Document } from "mongoose";

// Define the Booking interface
interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  roomName: string;
  roomId: mongoose.Types.ObjectId;
  slots: number;
  amount:number;
  paymentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}


const bookingSchema = new Schema<IBooking>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' ,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Room',
  },
  slots: {
    type: Number,
    required: true,
  },
  amount:{
    type:Number,
    required:true
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create and export the Booking model
const BookingModel: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;
