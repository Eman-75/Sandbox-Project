import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String }, 
  position: { type: String },    
  experienceLevel: { type: String }, 
  bio: { type: String }, 
  linkedInUrl: { type: String },
  investmentRange: { 
    min: { type: Number },
    max: { type: Number }
  },
  sectorsOfInterest: [{ type: String }],
  
  // Master NDA Tracking
  masterNda: {
    isSigned: { type: Boolean, default: false },
    signedAt: { type: Date },
    ipAddress: { type: String }, // Good for "legal" proof in your FYP
    documentVersion: { type: String, default: "1.0" }
  },
  
  // Cloudinary URLs
  idCardUrl: { type: String }, 
  proofOfFundsUrl: { type: String }, 
  profilePicture: { type: String },

  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('InvestorProfile', investorSchema);