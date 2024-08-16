import Otp from "../../domain/otp";
import mongoose, { Model, Schema } from "mongoose";

const OtpSchema: Schema<Otp> = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  number: { type: String },
  password: { type: String },
  otp: { type: Number, required: true },
  otpGeneratedAt: { type: Date, required: true },
});

const OtpModel: Model<Otp> = mongoose.model<Otp>("Otp", OtpSchema);

export default OtpModel;
