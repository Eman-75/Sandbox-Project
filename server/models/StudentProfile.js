import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNo: { type: String },
  department: { type: String },
  universityName: { type: String },
  degreeLevel: { type: String, enum: ['Bachelors', 'Masters', 'PhD'] },
  bio: { type: String }, 
  portfolioUrl: { type: String }, 
  interestCategories: [{ type: String }], 
  
  // Cloudinary URLs
  universityCardUrl: { type: String }, 
  resumeUrl: { type: String },
  fypFileUrl: { type: String },          
  profilePicture: { type: String },

  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentSchema);