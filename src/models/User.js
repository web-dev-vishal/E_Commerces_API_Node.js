import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true , unique: true },
  password: { type: String, require: true },
  isVerified: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
},{ timestamps: true })

export const User = mongoose.model('user', userSchema)