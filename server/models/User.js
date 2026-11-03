import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } 
  },
  googleId: { type: String, unique: true, sparse: true },
  role: { 
    type: String, 
    enum: ['admin', 'student', 'startup', 'investor'], 
    default: 'student' 
  },
  stripeAccountId: { type: String, default: "" },
  isVerified: { type: Boolean, default: false } // Good for Admin approval logic
}, { timestamps: true });

export default mongoose.model('User', userSchema);