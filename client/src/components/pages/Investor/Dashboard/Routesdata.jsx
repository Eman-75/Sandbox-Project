// import express from 'express';
// import { v2 as cloudinary } from 'cloudinary';
// import { protectRoute } from '../middleware/authMiddleware.js';
// import { upload } from '../middleware/multer.js';
// import User from '../models/User.js';
// import StudentProfile from '../models/StudentProfile.js';
// import InvestorProfile from '../models/InvestorProfile.js';
// import StartupProfile from '../models/StartupProfile.js';
// import { signMasterNda } from '../controller/investorController.js';
// import bcrypt from 'bcryptjs';
// import Investment from '../models/Investment.js';
// import Message from '../models/Message.js';
// import Connection from '../models/Connection.js';
// import NDA from '../models/NDA.js';

// const router = express.Router();

// router.get('/me', protectRoute, async (req, res) => {
//     try {
//         // Use req.user._id and req.user.role from authentication middleware
//         let profile = null;

//         if (req.user.role === 'student') {
//             profile = await StudentProfile.findOne({ userId: req.user._id });
//         } else if (req.user.role === 'investor') {
//             profile = await InvestorProfile.findOne({ userId: req.user._id });
//         } else if (req.user.role === 'startup') {
//             profile = await StartupProfile.findOne({ userId: req.user._id });
//         }

//         // If no profile exists yet, return an empty object instead of null
//         res.json(profile || {});
//     } catch (err) {
//         console.error("Fetch Profile Error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// router.get('/investors', protectRoute, async (req, res) => {
//     try {
//         const investorProfiles = await InvestorProfile.find({}).lean();
//         const investorUserIds = investorProfiles.map((ip) => ip.userId);
//         const users = await User.find({ _id: { $in: investorUserIds } }).select('name email');
        
//         const userMap = users.reduce((acc, user) => {
//             acc[user._id.toString()] = user;
//             return acc;
//         }, {});

//         const response = investorProfiles.map((profile) => {
//             const owner = userMap[profile.userId?.toString()] || {};
//             return {
//                 _id: profile._id,
//                 userId: profile.userId,
//                 name: owner.name || profile.companyName || 'Investor',
//                 email: owner.email || '',
//                 companyName: profile.companyName || '',
//                 position: profile.position || '',
//                 experienceLevel: profile.experienceLevel || '',
//                 bio: profile.bio || '',
//                 linkedInUrl: profile.linkedInUrl || '',
//                 investmentRange: profile.investmentRange || { min: 0, max: 0 },
//                 sectorsOfInterest: profile.sectorsOfInterest || [],
//                 idCardUrl: profile.idCardUrl || '',
//                 proofOfFundsUrl: profile.proofOfFundsUrl || '',
//                 profilePicture: profile.profilePicture || '',
//                 isProfileComplete: profile.isProfileComplete || false,
//             };
//         });

//         res.json({ success: true, investors: response });
//     } catch (err) {
//         console.error("Fetch Investors Error:", err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// });

// router.get('/startups', protectRoute, async (req, res) => {
//     try {
//         // 1. Fetch all startup profiles
//         const startupProfiles = await StartupProfile.find({}).lean();
//         const startupUserIds = startupProfiles.map((sp) => sp.userId);
        
//         // 2. Fetch associated User data (names and emails)
//         const users = await User.find({ _id: { $in: startupUserIds } }).select('name email');
        
//         const userMap = users.reduce((acc, user) => {
//             acc[user._id.toString()] = user;
//             return acc;
//         }, {});

//         // 3. Merge profile and user data
//         const response = startupProfiles.map((profile) => {
//             const owner = userMap[profile.userId?.toString()] || {};
//             return {
//                 _id: profile._id,
//                 userId: profile.userId,
//                 name: owner.name || 'Startup Owner',
//                 email: owner.email || '',
//                 companyName: profile.companyName || 'Untitled Startup',
//                 bio: profile.bio || '',
//                 fundingStage: profile.fundingStage || 'N/A',
//                 seekingAmount: profile.seekingAmount || 0,
//                 equityOffering: profile.equityOffering || 'N/A',
//                 foundingDate: profile.foundingDate,
//                 phoneNumber: profile.phoneNumber,
//                 pitchDeckUrl: profile.pitchDeckUrl || '',
//                 businessPlanUrl: profile.businessPlanUrl || '',
//                 companyLogo: profile.companyLogo || '',
//                 profilePicture: profile.profilePicture || '',
//                 isProfileComplete: profile.isProfileComplete || false,
//             };
//         });

//         res.json({ success: true, startups: response });
//     } catch (err) {
//         console.error("Fetch Startups Error:", err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// });

// router.get('/students', protectRoute, async (req, res) => {
//     try {
//         // 1. Find all completed student profiles
//         const profiles = await StudentProfile.find({}).lean();
        
//         // 2. Get the User IDs from those profiles
//         const userIds = profiles.map(p => p.userId);
        
//         // 3. Fetch names/emails from the User table
//         const users = await User.find({ _id: { $in: userIds } }).select('name email');
        
//         // 4. Create a map for quick lookup
//         const userMap = users.reduce((acc, u) => ({ ...acc, [u._id.toString()]: u }), {});

//         // 5. Merge the data
//         const formattedStudents = profiles.map(p => ({
//             ...p,
//             name: userMap[p.userId.toString()]?.name || 'Student',
//             email: userMap[p.userId.toString()]?.email || '',
//             // Mapping your schema fields to match the UI expectations
//             major: p.department,
//             university: p.universityName,
//             year: p.degreeLevel
//         }));

//         res.status(200).json({ success: true, users: formattedStudents });
//     } catch (error) {
//         console.error("Error fetching students:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Updated route with multer middleware to handle file uploads
// router.patch('/update-student-profile', protectRoute, upload.fields([
//     { name: 'universityCard', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//     { name: 'fypFile', maxCount: 1 },
//     { name: 'profilePicture', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         console.log("========== PROFILE UPDATE START ==========");
//         console.log("Step 1 - User Object:", JSON.stringify(req.user, null, 2));
//         console.log("Step 2 - User ID check - req.user._id:", req.user?._id);
//         console.log("Step 3 - Body data:", JSON.stringify(req.body, null, 2));
//         console.log("Step 4 - Files received:", req.files ? Object.keys(req.files) : "NO FILES");
        
//         if (req.files) {
//             for (let key in req.files) {
//                 console.log(File ${key}:, req.files[key][0].path);
//             }
//         }

//         if (!req.user?._id) {
//             console.log("ERROR: User context missing");
//             return res.status(401).json({ message: "User context missing" });
//         }

//         console.log("DEBUG - User ID type:", typeof req.user._id);
//         console.log("DEBUG - User ID value:", req.user._id);

//         const fileFieldMap = {
//             universityCard: 'universityCardUrl',
//             resume: 'resumeUrl',
//             fypFile: 'fypFileUrl',
//             profilePicture: 'profilePicture'
//         };

//         const extractPublicIdFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return null;
//             // Remove query params
//             let cleaned = url.split('?')[0];
//             // Remove Cloudinary prefix (cloud name + type + upload)
//             cleaned = cleaned.replace(/https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw|auto)\/upload\//, '');
//             // Remove version folder (v12345/) if present
//             cleaned = cleaned.replace(/v\d+\//, '');
//             // Remove extension
//             cleaned = cleaned.replace(/\.[^/.]+$/, '');
//             return cleaned;
//         };

//         const getResourceTypeFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return 'auto';
//             const m = url.match(/res\.cloudinary\.com\/[^/]+\/(image|video|raw|auto)\/upload/);
//             if (m && m[1]) return m[1];
//             const extension = url.split('?')[0].split('.').pop().toLowerCase();
//             if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'video';
//             if (['pdf', 'doc', 'docx', 'zip', 'txt'].includes(extension)) return 'raw';
//             return 'auto';
//         };

//         const updateData = {};
//         // Copy all req.body fields except array notation ones (to avoid MongoDB field name issues)
//         for (const [key, value] of Object.entries(req.body)) {
//             if (!key.includes('[') && !key.includes(']')) {
//                 updateData[key] = value;
//             }
//         }
//         console.log("Step 5 - Update data before file processing:", updateData);

//         // Delete old Cloudinary files when new ones are uploaded
//         if (req.files && Object.keys(req.files).length > 0) {
//             const existingProfile = await StudentProfile.findOne({ userId: req.user._id });
//             for (const field of Object.keys(req.files)) {
//                 const dbField = fileFieldMap[field];
//                 const oldUrl = existingProfile?.[dbField];
//                 if (oldUrl) {
//                     const publicId = extractPublicIdFromCloudinaryUrl(oldUrl);
//                     const resource_type = getResourceTypeFromCloudinaryUrl(oldUrl);
//                     if (publicId) {
//                         try {
//                             const destroyResult = await cloudinary.uploader.destroy(publicId, {
//                                 resource_type,
//                                 invalidate: true,
//                                 // force: true // uncomment if you want strong deletion semantics
//                             });
//                             console.log(🗑️  Deleted old Cloudinary asset: ${publicId}, destroyResult);
//                         } catch (deleteError) {
//                             console.warn(⚠️  Failed to delete old asset ${publicId}:, deleteError);
//                         }
//                     } else {
//                         console.warn(⚠️  Could not parse public_id from old URL: ${oldUrl});
//                     }
//                 }
//             }
//         }

//         // Process uploaded files and extract Cloudinary URLs
//         if (req.files) {
//             if (req.files['universityCard'] && req.files['universityCard'][0] && req.files['universityCard'][0].path) {
//                 updateData.universityCardUrl = req.files['universityCard'][0].path;
//                 console.log("✅ University Card URL:", updateData.universityCardUrl);
//             }
//             if (req.files['resume'] && req.files['resume'][0] && req.files['resume'][0].path) {
//                 updateData.resumeUrl = req.files['resume'][0].path;
//                 console.log("✅ Resume URL:", updateData.resumeUrl);
//             }
//             if (req.files['fypFile'] && req.files['fypFile'][0] && req.files['fypFile'][0].path) {
//                 updateData.fypFileUrl = req.files['fypFile'][0].path;
//                 console.log("✅ FYP File URL:", updateData.fypFileUrl);
//             }
//             if (req.files['profilePicture'] && req.files['profilePicture'][0] && req.files['profilePicture'][0].path) {
//                 updateData.profilePicture = req.files['profilePicture'][0].path;
//                 console.log("✅ Profile Picture URL:", updateData.profilePicture);
//             }
//         }

//         // Handle interestCategories array - FormData sends it as interestCategories[0], interestCategories[1], etc.
//         const interestArray = [];
//         let idx = 0;
//         while (req.body[interestCategories[${idx}]]) {
//             interestArray.push(req.body[interestCategories[${idx}]]);
//             idx++;
//         }
//         if (interestArray.length > 0) {
//             updateData.interestCategories = interestArray;
//             console.log("✅ Interest Categories:", updateData.interestCategories);
//         }

//         console.log("Step 6 - Final update data:", updateData);
//         console.log("Step 7 - Query: Looking for userId =", req.user._id);

//         const profile = await StudentProfile.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: updateData },
//             { new: true, upsert: true, runValidators: false }
//         );

//         console.log("Step 8 - Profile after update:", profile);
//         console.log("========== PROFILE UPDATE SUCCESS ==========");
//         res.json({ success: true, profile });
//     } catch (err) {
//         console.error("========== PROFILE UPDATE ERROR ==========");
//         console.error("Error Type:", err.constructor.name);
//         console.error("Error Message:", err.message);
//         console.error("Error Code:", err.code);
//         console.error("Full Error Object:", err);
//         console.error("Stack Trace:", err.stack);
//         console.error("========== END ERROR ==========");
//         res.status(500).json({ 
//             message: err.message, 
//             errorType: err.constructor.name,
//             fullError: err.toString()
//         });
//     }
// });

// // Updated route with multer middleware to handle file uploads for investor profile
// router.patch('/update-investor-profile', protectRoute, upload.fields([
//     { name: 'idCard', maxCount: 1 },
//     { name: 'proofOfFunds', maxCount: 1 },
//     { name: 'profilePicture', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         console.log("========== INVESTOR PROFILE UPDATE START ==========");
//         console.log("Step 1 - User Object:", JSON.stringify(req.user, null, 2));
//         console.log("Step 2 - User ID check - req.user._id:", req.user?._id);
//         console.log("Step 3 - Body data:", JSON.stringify(req.body, null, 2));
//         console.log("Step 4 - Files received:", req.files ? Object.keys(req.files) : "NO FILES");

//         if (req.files) {
//             for (let key in req.files) {
//                 console.log(File ${key}:, req.files[key][0].path);
//             }
//         }

//         if (!req.user?._id) {
//             console.log("ERROR: User context missing");
//             return res.status(401).json({ message: "User context missing" });
//         }

//         const fileFieldMap = {
//             idCard: 'idCardUrl',
//             proofOfFunds: 'proofOfFundsUrl',
//             profilePicture: 'profilePicture'
//         };

//         const extractPublicIdFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return null;
//             // Remove query params
//             let cleaned = url.split('?')[0];
//             // Remove Cloudinary prefix (cloud name + type + upload)
//             cleaned = cleaned.replace(/https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw|auto)\/upload\//, '');
//             // Remove version folder (v12345/) if present
//             cleaned = cleaned.replace(/v\d+\//, '');
//             // Remove extension
//             cleaned = cleaned.replace(/\.[^/.]+$/, '');
//             return cleaned;
//         };

//         const getResourceTypeFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return 'auto';
//             const m = url.match(/res\.cloudinary\.com\/[^/]+\/(image|video|raw|auto)\/upload/);
//             if (m && m[1]) return m[1];
//             const extension = url.split('?')[0].split('.').pop().toLowerCase();
//             if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'video';
//             if (['pdf', 'doc', 'docx', 'zip', 'txt'].includes(extension)) return 'raw';
//             return 'auto';
//         };

//         const updateData = {};
//         // Copy all req.body fields except array notation ones (to avoid MongoDB field name issues)
//         for (const [key, value] of Object.entries(req.body)) {
//             if (!key.includes('[') && !key.includes(']')) {
//                 updateData[key] = value;
//             }
//         }
//         console.log("Step 5 - Update data before file processing:", updateData);

//         // Delete old Cloudinary files when new ones are uploaded
//         if (req.files && Object.keys(req.files).length > 0) {
//             const existingProfile = await InvestorProfile.findOne({ userId: req.user._id });
//             for (const field of Object.keys(req.files)) {
//                 const dbField = fileFieldMap[field];
//                 const oldUrl = existingProfile?.[dbField];
//                 if (oldUrl) {
//                     const publicId = extractPublicIdFromCloudinaryUrl(oldUrl);
//                     const resource_type = getResourceTypeFromCloudinaryUrl(oldUrl);
//                     if (publicId) {
//                         try {
//                             const destroyResult = await cloudinary.uploader.destroy(publicId, {
//                                 resource_type,
//                                 invalidate: true,
//                             });
//                             console.log(🗑️  Deleted old Cloudinary asset: ${publicId}, destroyResult);
//                         } catch (deleteError) {
//                             console.warn(⚠️  Failed to delete old asset ${publicId}:, deleteError);
//                         }
//                     } else {
//                         console.warn(⚠️  Could not parse public_id from old URL: ${oldUrl});
//                     }
//                 }
//             }
//         }

//         // Process uploaded files and extract Cloudinary URLs
//         if (req.files) {
//             if (req.files['idCard'] && req.files['idCard'][0] && req.files['idCard'][0].path) {
//                 updateData.idCardUrl = req.files['idCard'][0].path;
//                 console.log("✅ ID Card URL:", updateData.idCardUrl);
//             }
//             if (req.files['proofOfFunds'] && req.files['proofOfFunds'][0] && req.files['proofOfFunds'][0].path) {
//                 updateData.proofOfFundsUrl = req.files['proofOfFunds'][0].path;
//                 console.log("✅ Proof of Funds URL:", updateData.proofOfFundsUrl);
//             }
//             if (req.files['profilePicture'] && req.files['profilePicture'][0] && req.files['profilePicture'][0].path) {
//                 updateData.profilePicture = req.files['profilePicture'][0].path;
//                 console.log("✅ Profile Picture URL:", updateData.profilePicture);
//             }
//         }

//         // Handle sectorsOfInterest array - FormData sends it as sectorsOfInterest[0], sectorsOfInterest[1], etc.
//         const sectorsArray = [];
//         let idx = 0;
//         while (req.body[sectorsOfInterest[${idx}]]) {
//             sectorsArray.push(req.body[sectorsOfInterest[${idx}]]);
//             idx++;
//         }
//         if (sectorsArray.length > 0) {
//             updateData.sectorsOfInterest = sectorsArray;
//             console.log("✅ Sectors of Interest:", updateData.sectorsOfInterest);
//         }

//         // Handle investmentRange object
//         if (req.body['investmentRange[min]'] !== undefined && req.body['investmentRange[max]'] !== undefined) {
//             updateData.investmentRange = {
//                 min: parseInt(req.body['investmentRange[min]']) || 0,
//                 max: parseInt(req.body['investmentRange[max]']) || 0
//             };
//             console.log("✅ Investment Range:", updateData.investmentRange);
//         }

//         console.log("Step 6 - Final update data:", updateData);
//         console.log("Step 7 - Query: Looking for userId =", req.user._id);

//         console.log("DEBUG - updateData keys:", Object.keys(updateData));
//         console.log("DEBUG - updateData sample:", JSON.stringify(updateData).substring(0, 500));

//         const profile = await InvestorProfile.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: updateData },
//             { new: true, upsert: true, runValidators: false }
//         );

//         console.log("Step 8 - Profile after update:", profile);
//         console.log("========== INVESTOR PROFILE UPDATE SUCCESS ==========");
//         res.json({ success: true, profile });
//     } catch (err) {
//         console.error("========== INVESTOR PROFILE UPDATE ERROR ==========");
//         console.error("Error Type:", err.constructor.name);
//         console.error("Error Message:", err.message);
//         console.error("Error Code:", err.code);
//         console.error("Full Error Object:", err);
//         console.error("Stack Trace:", err.stack);
//         console.error("========== END ERROR ==========");
//         res.status(500).json({
//             message: err.message,
//             errorType: err.constructor.name,
//             fullError: err.toString()
//         });
//     }
// });

// // Updated route with multer middleware to handle file uploads for startup profile
// router.patch('/update-startup-profile', protectRoute, upload.fields([
//     { name: 'pitchDeck', maxCount: 1 },
//     { name: 'businessPlan', maxCount: 1 },
//     { name: 'companyLogo', maxCount: 1 },
//     { name: 'profilePicture', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         console.log("========== STARTUP PROFILE UPDATE START ==========");
//         console.log("Step 1 - User Object:", JSON.stringify(req.user, null, 2));
//         console.log("Step 2 - User ID check - req.user._id:", req.user?._id);
//         console.log("Step 3 - Body data:", JSON.stringify(req.body, null, 2));
//         console.log("Step 4 - Files received:", req.files ? Object.keys(req.files) : "NO FILES");

//         if (req.files) {
//             for (let key in req.files) {
//                 console.log(File ${key}:, req.files[key][0].path);
//             }
//         }

//         if (!req.user?._id) {
//             console.log("ERROR: User context missing");
//             return res.status(401).json({ message: "User context missing" });
//         }

//         const fileFieldMap = {
//             pitchDeck: 'pitchDeckUrl',
//             businessPlan: 'businessPlanUrl',
//             companyLogo: 'companyLogo',
//             profilePicture: 'profilePicture'
//         };

//         const extractPublicIdFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return null;
//             // Remove query params
//             let cleaned = url.split('?')[0];
//             // Remove Cloudinary prefix (cloud name + type + upload)
//             cleaned = cleaned.replace(/https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw|auto)\/upload\//, '');
//             // Remove version folder (v12345/) if present
//             cleaned = cleaned.replace(/v\d+\//, '');
//             // Remove extension
//             cleaned = cleaned.replace(/\.[^/.]+$/, '');
//             return cleaned;
//         };

//         const getResourceTypeFromCloudinaryUrl = (url) => {
//             if (!url || typeof url !== 'string') return 'auto';
//             const m = url.match(/res\.cloudinary\.com\/[^/]+\/(image|video|raw|auto)\/upload/);
//             if (m && m[1]) return m[1];
//             const extension = url.split('?')[0].split('.').pop().toLowerCase();
//             if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'video';
//             if (['pdf', 'doc', 'docx', 'zip', 'txt'].includes(extension)) return 'raw';
//             return 'auto';
//         };

//         const updateData = {};
//         // Copy all req.body fields except array notation ones (to avoid MongoDB field name issues)
//         for (const [key, value] of Object.entries(req.body)) {
//             if (!key.includes('[') && !key.includes(']')) {
//                 updateData[key] = value;
//             }
//         }
//         console.log("Step 5 - Update data before file processing:", updateData);

//         // Delete old Cloudinary files when new ones are uploaded
//         if (req.files && Object.keys(req.files).length > 0) {
//             const existingProfile = await StartupProfile.findOne({ userId: req.user._id });
//             for (const field of Object.keys(req.files)) {
//                 const dbField = fileFieldMap[field];
//                 const oldUrl = existingProfile?.[dbField];
//                 if (oldUrl) {
//                     const publicId = extractPublicIdFromCloudinaryUrl(oldUrl);
//                     const resource_type = getResourceTypeFromCloudinaryUrl(oldUrl);
//                     if (publicId) {
//                         try {
//                             const destroyResult = await cloudinary.uploader.destroy(publicId, {
//                                 resource_type,
//                                 invalidate: true,
//                             });
//                             console.log(🗑️  Deleted old Cloudinary asset: ${publicId}, destroyResult);
//                         } catch (deleteError) {
//                             console.warn(⚠️  Failed to delete old asset ${publicId}:, deleteError);
//                         }
//                     } else {
//                         console.warn(⚠️  Could not parse public_id from old URL: ${oldUrl});
//                     }
//                 }
//             }
//         }

//         // Process uploaded files and extract Cloudinary URLs
//         if (req.files) {
//             if (req.files['pitchDeck'] && req.files['pitchDeck'][0] && req.files['pitchDeck'][0].path) {
//                 updateData.pitchDeckUrl = req.files['pitchDeck'][0].path;
//                 console.log("✅ Pitch Deck URL:", updateData.pitchDeckUrl);
//             }
//             if (req.files['businessPlan'] && req.files['businessPlan'][0] && req.files['businessPlan'][0].path) {
//                 updateData.businessPlanUrl = req.files['businessPlan'][0].path;
//                 console.log("✅ Business Plan URL:", updateData.businessPlanUrl);
//             }
//             if (req.files['companyLogo'] && req.files['companyLogo'][0] && req.files['companyLogo'][0].path) {
//                 updateData.companyLogo = req.files['companyLogo'][0].path;
//                 console.log("✅ Company Logo URL:", updateData.companyLogo);
//             }
//             if (req.files['profilePicture'] && req.files['profilePicture'][0] && req.files['profilePicture'][0].path) {
//                 updateData.profilePicture = req.files['profilePicture'][0].path;
//                 console.log("✅ Profile Picture URL:", updateData.profilePicture);
//             }
//         }

//         console.log("Step 6 - Final update data:", updateData);
//         console.log("Step 7 - Query: Looking for userId =", req.user._id);

//         const profile = await StartupProfile.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: updateData },
//             { new: true, upsert: true, runValidators: false }
//         );

//         console.log("Step 8 - Profile after update:", profile);
//         console.log("========== STARTUP PROFILE UPDATE SUCCESS ==========");
//         res.json({ success: true, profile });
//     } catch (err) {
//         console.error("========== STARTUP PROFILE UPDATE ERROR ==========");
//         console.error("Error Type:", err.constructor.name);
//         console.error("Error Message:", err.message);
//         console.error("Error Code:", err.code);
//         console.error("Full Error Object:", err);
//         console.error("Stack Trace:", err.stack);
//         console.error("========== END ERROR ==========");
//         res.status(500).json({
//             message: err.message,
//             errorType: err.constructor.name,
//             fullError: err.toString()
//         });
//     }
// });

// // CHANGE OR SET PASSWORD
// router.post('/change-password', protectRoute, async (req, res) => {
//   try {
//     const { currentPassword, oldPassword, newPassword } = req.body;
//     const passwordToCheck = currentPassword || oldPassword;

//     if (!newPassword) {
//       return res.status(400).json({ message: "New password is required." });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // CASE 1: User already has a password (standard or Google user who already set one)
//     if (user.password) {
//       if (!passwordToCheck) {
//         return res.status(400).json({ message: "Current password is required to change it." });
//       }

//       const isMatch = await bcrypt.compare(passwordToCheck, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Incorrect current password" });
//       }
//     }

//     // Hash and Save
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();

//     res.status(200).json({ 
//       success: true, 
//       message: user.password ? "Password updated successfully" : "Password set successfully" 
//     });
//   } catch (err) {
//     console.error("Password change error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // Investor specific routes
// router.get('/investor/profile', protectRoute, async (req, res) => {
//   try {
//     const profile = await InvestorProfile.findOne({ userId: req.user._id });
//     if (!profile) {
//       return res.status(404).json({ message: "Investor profile not found" });
//     }
//     const user = await User.findById(req.user._id).select('name');
//     res.json({ profile: { ...profile.toObject(), name: user.name } });
//   } catch (err) {
//     console.error("Fetch investor profile error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post('/investor/sign-nda', protectRoute, signMasterNda);

// // Investor Dashboard Data
// router.get('/investor/dashboard', protectRoute, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const profile = await InvestorProfile.findOne({ userId });

//     const investments = await Investment.find({ investor: userId })
//       .populate('startup', 'name role')
//       .sort({ createdAt: -1 });

//     const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
//     const totalInvestments = investments.length;
//     const completedDeals = investments.filter(inv => inv.status === 'completed').length;
//     const pendingInvestments = investments.filter(inv => inv.status === 'pending').length;

//     const uniqueStartupIds = new Set(
//       investments
//         .map(inv => inv.startup?._id?.toString?.() || inv.startup?.toString?.())
//         .filter(Boolean)
//     );

//     const signedNdas = await NDA.find({
//       investor: userId,
//       status: 'signed',
//       $or: [
//         { sender: { $exists: true, $ne: null } },
//         { receiver: { $exists: true, $ne: null } }
//       ]
//     }).select('sender receiver');

//     const ndaConnectionIds = new Set();
//     signedNdas.forEach((nda) => {
//       [nda.sender, nda.receiver].forEach((partyId) => {
//         const party = partyId?.toString?.();
//         if (party && party !== userId.toString()) {
//           ndaConnectionIds.add(party);
//         }
//       });
//     });

//     const acceptedConnections = await Connection.find({
//       $or: [
//         { from: userId, status: 'accepted' },
//         { to: userId, status: 'accepted' }
//       ]
//     }).select('from to');

//     acceptedConnections.forEach((connection) => {
//       [connection.from, connection.to].forEach((partyId) => {
//         const party = partyId?.toString?.();
//         if (party && party !== userId.toString()) {
//           ndaConnectionIds.add(party);
//         }
//       });
//     });

//     const monthlyInvestmentMap = new Map(
//       ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//         .map((month) => [month, 0])
//     );

//     investments.forEach((investment) => {
//       const monthLabel = new Date(investment.createdAt).toLocaleString('en-US', { month: 'short' });
//       monthlyInvestmentMap.set(
//         monthLabel,
//         (monthlyInvestmentMap.get(monthLabel) || 0) + 1
//       );
//     });

//     const statusDistribution = ['completed', 'pending', 'failed'].map((status) => ({
//       name: status.charAt(0).toUpperCase() + status.slice(1),
//       value: investments.filter((investment) => investment.status === status).length
//     }));

//     res.json({
//       stats: {
//         totalInvestment,
//         totalInvestments,
//         completedDeals,
//         pendingInvestments,
//         startupsBacked: uniqueStartupIds.size,
//         investmentTarget: profile?.investmentRange?.max || 0,
//         totalConnections: ndaConnectionIds.size
//       },
//       monthlyInvestmentCounts: Array.from(monthlyInvestmentMap, ([month, count]) => ({
//         month,
//         count
//       })),
//       investmentStatusDistribution: statusDistribution,
//       recentProposals: investments.slice(0, 5).map((proposal) => ({
//         id: proposal._id,
//         startupName: proposal.startup?.name || 'Unknown Startup',
//         amount: proposal.amount,
//         status: proposal.status,
//         date: proposal.createdAt
//       }))
//     });
//   } catch (error) {
//     console.error('Error fetching investor dashboard:', error);
//     res.status(500).json({ message: 'Failed to load dashboard data' });
//   }
// });

// // Startup Dashboard Data
// router.get('/startup/dashboard', protectRoute, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const profile = await StartupProfile.findOne({ userId });

//     const investments = await Investment.find({ startup: userId })
//       .populate('investor', 'name')
//       .sort({ createdAt: -1 });

//     const completedInvestments = investments.filter(inv => inv.status === 'completed');
//     const pendingInvestments = investments.filter(inv => inv.status === 'pending');
//     const totalFunded = completedInvestments.reduce((sum, inv) => sum + (inv.startupAmount || inv.amount || 0), 0);
//     const uniqueInvestorIds = new Set(
//       investments.map(inv => inv.investor?._id?.toString?.() || inv.investor?.toString?.()).filter(Boolean)
//     );

//     const acceptedConnections = await Connection.find({
//       $or: [
//         { from: userId, status: 'accepted' },
//         { to: userId, status: 'accepted' }
//       ]
//     }).populate('from', 'role').populate('to', 'role');

//     const matchedInvestors = acceptedConnections.filter((connection) => {
//       const otherUser = connection.from._id.toString() === userId.toString() ? connection.to : connection.from;
//       return otherUser?.role === 'investor';
//     }).length;

//     const messages = await Message.find({
//       $or: [
//         { senderId: userId },
//         { receiverId: userId }
//       ]
//     }).sort({ createdAt: -1 }).populate('senderId', 'name').populate('receiverId', 'name');

//     const newMessages = messages.filter(
//       (msg) => msg.receiverId?._id?.toString?.() === userId.toString() && !msg.seen
//     ).length;

//     const profileTasks = [
//       {
//         title: "Company Information",
//         description: "Company name, stage, amount and equity details",
//         completed: Boolean(profile?.companyName && profile?.fundingStage && profile?.seekingAmount && profile?.equityOffering)
//       },
//       {
//         title: "Pitch Deck",
//         description: "Upload your startup pitch deck",
//         completed: Boolean(profile?.pitchDeckUrl)
//       },
//       {
//         title: "Business Plan",
//         description: "Upload your business plan document",
//         completed: Boolean(profile?.businessPlanUrl)
//       },
//       {
//         title: "Brand Assets",
//         description: "Add your company logo or profile image",
//         completed: Boolean(profile?.companyLogo || profile?.profilePicture)
//       }
//     ];

//     const completedProfileTasks = profileTasks.filter((task) => task.completed).length;
//     const profileCompletion = profileTasks.length
//       ? Math.round((completedProfileTasks / profileTasks.length) * 100)
//       : 0;

//     res.json({
//       stats: {
//         activeProposals: pendingInvestments.length,
//         matchedInvestors,
//         fundsRaised: totalFunded,
//         messages: newMessages
//       },
//       profileCompletion,
//       profileTasks,
//       recentMessages: messages.slice(0, 5).map(msg => ({
//         id: msg._id,
//         sender: msg.senderId?._id?.toString?.() === userId.toString() ? msg.receiverId?.name : msg.senderId?.name,
//         message: msg.text || 'Image message',
//         date: msg.createdAt,
//         read: msg.seen
//       })),
//       recentProposals: investments.slice(0, 5).map(inv => ({
//         id: inv._id,
//         investorName: inv.investor?.name || 'Unknown Investor',
//         amount: inv.amount,
//         status: inv.status,
//         date: inv.createdAt
//       }))
//     });
//   } catch (error) {
//     console.error('Error fetching startup dashboard:', error);
//     res.status(500).json({ message: 'Failed to load dashboard data' });
//   }
// });

// // Student Dashboard Data
// router.get('/student/dashboard', protectRoute, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const profile = await StudentProfile.findOne({ userId });

//     const messages = await Message.find({
//       $or: [
//         { senderId: userId },
//         { receiverId: userId }
//       ]
//     }).sort({ createdAt: -1 }).populate('senderId', 'name').populate('receiverId', 'name');

//     const newMessages = messages.filter(
//       (msg) => msg.receiverId?._id?.toString?.() === userId.toString() && !msg.seen
//     ).length;

//     const acceptedConnections = await Connection.find({
//       $or: [
//         { from: userId, status: 'accepted' },
//         { to: userId, status: 'accepted' }
//       ]
//     }).populate('from', 'role').populate('to', 'role');

//     const relevantConnections = acceptedConnections.filter((connection) => {
//       const otherUser = connection.from._id.toString() === userId.toString() ? connection.to : connection.from;
//       return otherUser?.role === 'investor' || otherUser?.role === 'startup';
//     });

//     const documentCount = [
//       profile?.universityCardUrl,
//       profile?.resumeUrl,
//       profile?.fypFileUrl
//     ].filter(Boolean).length;

//     const interestAreas = profile?.interestCategories?.length || 0;

//     const profileTasks = [
//       {
//         title: "Basic Information",
//         description: "Name, email, department and degree details",
//         completed: Boolean(profile?.department && profile?.universityName && profile?.degreeLevel)
//       },
//       {
//         title: "University Card",
//         description: "Upload your university ID card for verification",
//         completed: Boolean(profile?.universityCardUrl)
//       },
//       {
//         title: "Resume",
//         description: "Upload your resume to showcase your skills",
//         completed: Boolean(profile?.resumeUrl)
//       },
//       {
//         title: "Final Year Project",
//         description: "Upload project files and documentation",
//         completed: Boolean(profile?.fypFileUrl)
//       }
//     ];

//     const completedProfileTasks = profileTasks.filter((task) => task.completed).length;
//     const profileCompletion = profileTasks.length
//       ? Math.round((completedProfileTasks / profileTasks.length) * 100)
//       : 0;

//     res.json({
//       stats: {
//         uploadedDocuments: documentCount,
//         messages: newMessages,
//         connections: relevantConnections.length,
//         interestAreas
//       },
//       profileCompletion,
//       recentMessages: messages.slice(0, 5).map(msg => ({
//         id: msg._id,
//         sender: msg.senderId?._id?.toString?.() === userId.toString() ? msg.receiverId?.name : msg.senderId?.name,
//         message: msg.text || 'Image message',
//         date: msg.createdAt,
//         read: msg.seen
//       })),
//       profileTasks
//     });
//   } catch (error) {
//     console.error('Error fetching student dashboard:', error);
//     res.status(500).json({ message: 'Failed to load dashboard data' });
//   }
// });

// export default router;