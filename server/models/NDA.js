import mongoose from "mongoose";

const ndaSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  signatureData: { type: String, required: true }, // Stores the drawn signature
  status: { type: String, enum: ['pending', 'signed'], default: 'signed' },
  contentVersion: { type: String, default: "1.0" },
  ipAddress: { type: String }, // For legal evidence
}, { timestamps: true });

export default mongoose.model("NDA", ndaSchema);