import Room from "../../domain/room"
import mongoose, { Model, Schema } from 'mongoose';

const uroomSchema: Schema<Room > = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    userId:{
        type:String,
        required:true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    slots:{
        type:Number,
        require:true
    },
    maintenanceCharge: {
      type: String,
      required: true,
    },
    securityDeposit:{
        type:String,
    },
    gender:{
        type:String,
        
    },
    roomType:{
      type:String,
  },
  noticePeriod:{
        type:String,
       
    },
    electricityCharge:{
        type:String,
       
    },
    location:{
        type:String
    },
    description:{
        type:String
    },
    isAproved:{
        type:Boolean,
        default:false
    },
    coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images:{
        type: [String], required: true
    }
  });

  const RoomModel:Model<Room> =mongoose.model<Room>(
    "Room",
    uroomSchema
)

export default RoomModel;

