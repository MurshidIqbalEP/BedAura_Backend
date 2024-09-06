import mongoose, { Model, Schema, Document } from "mongoose";

// Define the Booking interface
interface IBooking extends Document {
  userId: string;
  roomName: string;
  roomId: string;
  slots: number;
  paymentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Booking schema
const bookingSchema = new Schema<IBooking>({
  userId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  slots: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
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