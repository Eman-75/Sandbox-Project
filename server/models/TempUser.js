// backend/models/TempUser.js
import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  otpCode: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: { expires: '24h' } // This is the TTL magic
  }
});

export default mongoose.model("TempUser", tempUserSchema);