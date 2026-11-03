import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import { sendMail } from '../helper/sendMail.js';
import Notification from '../models/Notification.js';
import StudentProfile from '../models/StudentProfile.js';
import StartupProfile from '../models/StartupProfile.js';
import InvestorProfile from '../models/InvestorProfile.js';
import { createNotification } from '../helper/notificationHelper.js';
import { createProfileForUser } from '../helper/profileHelper.js';
import { OAuth2Client } from 'google-auth-library';
import { signupTemp, verifyOTP } from "../controller/authController.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// REGISTER (Signup)
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password (Security!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Create the empty profile linked to the new User's ID
    try {
      if (role === 'startup') {
        await StartupProfile.create({ userId: newUser._id, companyName: name });
      } else if (role === 'student') {
        await StudentProfile.create({ userId: newUser._id });
      } else if (role === 'investor') {
        await InvestorProfile.create({ userId: newUser._id });
      }
    } catch (profileErr) {
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ message: "Profile creation failed. Please try again." });
    }
    // Empty profile created

    res.status(201).json({ message: "User registered successfully" });
    await createNotification(
      newUser._id,
      'reminder',
      'Welcome to SandBox!',
      'Your account is pending verification. We will notify you once approved.'
    );
    await sendMail(email, "Welcome to SandBox!", "Thank you for registering at SandBox. Your account is pending verification by our team. We will notify you once it's approved.");

  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password" });

    // AUTHORIZATION: Create Token with the User's Role
    // include userId so middleware can decode correctly
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let profile = null;
    if (user.role === 'startup') profile = await StartupProfile.findOne({ userId: user._id });
    else if (user.role === 'student') profile = await StudentProfile.findOne({ userId: user._id });
    else if (user.role === 'investor') profile = await InvestorProfile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      token,
      userData: {
        _id: user._id,
        profileId: profile?._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: profile?.profilePicture || ""
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to check current auth state (used by frontend on load)
// router.get('/auth/check', protectRoute, (req, res) => {
//   res.json({ success: true, user: req.user });
// });

// Inside your GET /auth/check route
// Inside your auth routes file
router.get('/auth/check', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id; 
    const role = req.user.role;

    // 1. Fetch FRESH user data from DB to ensure we have the stripeAccountId
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 2. Fetch the corresponding profile for the picture
    let profile = null;
    if (role === 'startup') profile = await StartupProfile.findOne({ userId });
    else if (role === 'student') profile = await StudentProfile.findOne({ userId });
    else if (role === 'investor') profile = await InvestorProfile.findOne({ userId });

    // 3. Send back the combined data
    res.json({ 
      success: true, 
      user: { 
        ...user._doc, // This now definitely includes stripeAccountId
        profilePicture: profile?.profilePicture || "" 
      } 
    });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(500).json({ success: false });
  }
});

// Before it was router.get('/all-users', ...)
// Now change it to:
router.get('/all-users', async (req, res) => {
  try {
    // This tells MongoDB: "Find all users WHERE role is NOT 'admin'"
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// DELETE USER
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Delete the specific profile linked to this user
    if (user.role === 'startup') await StartupProfile.findOneAndDelete({ userId: user._id });
    if (user.role === 'student') await StudentProfile.findOneAndDelete({ userId: user._id });
    if (user.role === 'investor') await InvestorProfile.findOneAndDelete({ userId: user._id });

    // 2. Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User and their profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

// UPDATE USER
router.patch('/users/:id', async (req, res) => {
  try {
    // ONLY allow name and isVerified to be updated here
    const { name, isVerified } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, isVerified } },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
    if (req.body.isVerified === true) {
      await sendMail(updatedUser.email, "Access Granted: You can now chat with Investors on SandBox!", "", "<div><h3>Hello,</h3></br> <h4>Great news! Your SandBox profile has been officially verified by our team.</h4> <p>You now have full access to our networking features, including direct messaging with registered investors and secure pitch sharing. You can start chatting with investors right now by visiting your dashboard. We look forward to seeing your progress!</p></br><p> Best regards, </p></br><p>The SandBox Team</p></div>");
      await createNotification(
        updatedUser._id,
        'milestone', // or 'proposal'
        'Profile Verified',
        'Great news! You can now chat with investors and access all features.'
      );
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

const handleGoogleSignup = async (req, res) => {
  try {
    const { token, role } = req.body; // Token from frontend

    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // 2. Find or Create User
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new User({ name, email, googleId, role, isVerified: false });
      await user.save();

      try {
        await createProfileForUser(user._id, role, name);
      } catch (profileErr) {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ message: "Profile creation failed." });
      }
    }

    // 3. Issue your App's JWT
    const appToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Add these lines before res.status(200)
    let profile = null;
    if (user.role === 'startup') profile = await StartupProfile.findOne({ userId: user._id });
    else if (user.role === 'student') profile = await StudentProfile.findOne({ userId: user._id });
    else if (user.role === 'investor') profile = await InvestorProfile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      token: appToken,
      userData: { 
        _id: user._id, 
        role: user.role, 
        name: user.name, 
        profilePicture: profile?.profilePicture || "" 
      }
    });
    await createNotification(
      user._id,
      'reminder',
      'Welcome to SandBox!',
      'Your account is pending verification. We will notify you once approved.'
    );
    await sendMail(email, "Welcome to SandBox!", "Thank you for registering at SandBox. Your account is pending verification by our team. We will notify you once it's approved.");
  } catch (err) {
    res.status(500).json({ message: "Google Auth failed", error: err.message });
  }
};

const handleGoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email } = payload;

    // 2. Find User (using either googleId or email)
    const user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this Google email. Please sign up first."
      });
    }

    // 3. Fetch their specific profile to get the profileId
    let profile = null;
    if (user.role === 'startup') profile = await StartupProfile.findOne({ userId: user._id });
    else if (user.role === 'student') profile = await StudentProfile.findOne({ userId: user._id });
    else if (user.role === 'investor') profile = await InvestorProfile.findOne({ userId: user._id });

    // 4. Issue your App's JWT
    const appToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token: appToken,
      userData: {
        _id: user._id,
        role: user.role,
        name: user.name,
        profileId: profile?._id,
        profilePicture: profile?.profilePicture || ""
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Google Login failed", error: err.message });
  }
};

// Google signup
router.post('/auth/google-signup', handleGoogleSignup);

// Google login
router.post('/auth/google-login', handleGoogleLogin);
router.post('/google-login', handleGoogleLogin);

// TEMPORARY SIGNUP & OTP VERIFICATION
router.post("/auth/signup-temp", signupTemp);
router.post("/auth/verify-otp", verifyOTP);

export default router;
