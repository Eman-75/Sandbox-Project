import bcrypt from "bcryptjs";
import TempUser from "../models/TempUser.js";
import User from "../models/User.js";
import { sendMail } from "../helper/sendMail.js";
import StudentProfile from '../models/StudentProfile.js';
import StartupProfile from '../models/StartupProfile.js';
import InvestorProfile from '../models/InvestorProfile.js';
import { createNotification } from '../helper/notificationHelper.js';


export const signupTemp = async (req, res) => {
  try {
    const { name, email, password, role, resend } = req.body;

    // --- CASE 1: RESEND OTP ---
    if (resend) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const updatedTemp = await TempUser.findOneAndUpdate(
        { email },
        { otpCode, createdAt: Date.now() },
        { new: true }
      );

      if (!updatedTemp) {
        return res.status(404).json({ success: false, message: "Session expired. Please sign up again." });
      }

      await sendMail(email, "Your New Verification Code", `Your code is ${otpCode}`);
      return res.status(200).json({ success: true, message: "New OTP sent!" });
    }

    // --- CASE 2: NEW SIGNUP ---
    // 1. Check if user already exists in permanent collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    // 2. Hash password & Generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save/Update TempUser
    await TempUser.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, role, otpCode, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // 4. Send Email
    const htmlContent = `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Verify Your SandBox Account</h2>
        <p>Use the code below to complete your registration.</p>
        <h1 style="color: #e39622; font-size: 48px; letter-spacing: 10px;">${otpCode}</h1>
      </div>
    `;
    await sendMail(email, "Your Verification Code", `Your code is ${otpCode}`, htmlContent);

    // 5. CRITICAL: Send response to frontend to unlock the button
    return res.status(200).json({ success: true, message: "OTP sent to your email!" });

  } catch (error) {
    console.error("Signup Temp Error:", error);
    return res.status(500).json({ success: false, message: "Server error during signup." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find the temporary record
    const tempUser = await TempUser.findOne({ email, otpCode: otp });
    if (!tempUser) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // 2. Create the Permanent User (Matches your register route)
    const newUser = new User({ 
      name: tempUser.name, 
      email: tempUser.email, 
      password: tempUser.password, // This was already hashed in signupTemp
      role: tempUser.role,
      isEmailVerified: true,
      isVerified: false // Pending Admin Approval
    });
    
    await newUser.save();

    // 3. Create the Role-Specific Profile (Logic copied from your register route)
    try {
      if (tempUser.role === 'startup') {
        await StartupProfile.create({ userId: newUser._id, companyName: tempUser.name });
      } else if (tempUser.role === 'student') {
        await StudentProfile.create({ userId: newUser._id });
      } else if (tempUser.role === 'investor') {
        await InvestorProfile.create({ userId: newUser._id });
      }
    } catch (profileErr) {
      // Rollback: if profile fails, delete the user so they can try again
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ success: false, message: "Profile creation failed. Please try again." });
    }

    // 4. Create "Welcome" Notification (Matches your register route)
    await createNotification(
      newUser._id,
      'reminder',
      'Welcome to SandBox!',
      'Your account is pending verification. We will notify you once approved.'
    );

    // 5. Send Welcome Email (Matches your register route)
    await sendMail(
      email, 
      "Welcome to SandBox!", 
      "Thank you for registering at SandBox. Your account is pending verification by our team. We will notify you once it's approved."
    );

    // 6. Clean up Temp Record
    await TempUser.deleteOne({ _id: tempUser._id });

    return res.status(201).json({ 
      success: true, 
      message: "Email verified successfully! Your account is now pending admin approval." 
    });

  } catch (error) {
    console.error("VERIFICATION ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};