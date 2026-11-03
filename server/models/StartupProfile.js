import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  foundingDate: { type: Date },
  bio: { type: String },
  fundingStage: { type: String, enum: ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+'] },
  seekingAmount: { type: Number },
  equityOffering: { type: String }, 
  
  // Document Uploads (Store URLs from Cloudinary/AWS)
  pitchDeckUrl: { type: String },
  businessPlanUrl: { type: String },
  companyLogo: { type: String },
  profilePicture: { type: String },
  
  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('StartupProfile', startupSchema);