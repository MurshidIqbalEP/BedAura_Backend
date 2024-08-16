import User from "../../domain/user"
import mongoose, { Model, Schema } from 'mongoose';

const userSchema: Schema<User > = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    number:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isVerified:{
      type:Boolean,
      default:false
  },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isGoogle:{
        type:Boolean,
        default:false
    }
  });

  const UserModel:Model<User> =mongoose.model<User>(
    "User",
    userSchema
)

export default UserModel;

