import Room from "../../domain/room";
import mongoose, { Model, Schema } from "mongoose";

const uroomSchema: Schema<Room> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  slots: {
    type: Number,
    require: true,
  },
  maintenanceCharge: {
    type: String,
    required: true,
  },
  securityDeposit: {
    type: String,
  },
  gender: {
    type: String,
  },
  roomType: {
    type: String,
  },
  noticePeriod: {
    type: String,
  },

  location: {
    type: String,
  },
  description: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isEdited:{
    type:Boolean,
    default:false,
  },
  isListed:{
    type:Boolean,
    default:true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  additionalOptions:{
    type:[String],
  },
  images: {
    type: [String],
    required: true,
  },
  rejectionReason:{
    type:String
  }
});

uroomSchema.index({ coordinates: "2dsphere" });
const RoomModel: Model<Room> = mongoose.model<Room>("Room", uroomSchema);

export default RoomModel;
