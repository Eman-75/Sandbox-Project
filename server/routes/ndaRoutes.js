import express from 'express';
import NDA from '../models/NDA.js';
import InvestorProfile from '../models/InvestorProfile.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * 1. GET NDA STATUS
 * This route checks if a signed NDA exists and RETURNS the full object (including signatureData)
 */
router.get("/status/:userId", protectRoute, async (req, res) => {
    try {
        const authUserId = req.user._id; // Now safe because of protectRoute
        const otherUserId = req.params.userId;

        const nda = await NDA.findOne({
            $or: [
                { sender: authUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: authUserId },
                { investor: authUserId }
            ],
            status: 'signed'
        });

        if (nda) {
            // isSigned: true matches your Messages.jsx check
            return res.status(200).json({ isSigned: true, nda });
        }
        
        res.status(200).json({ isSigned: false });
    } catch (error) {
        console.error("Status Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * 2. SIGN AND SAVE NDA
 * Saves the signature and IP address
 */
router.post("/sign", protectRoute, async (req, res) => {
    try {
        const { signatureData } = req.body;
        const investorId = req.user._id;

        if (!signatureData) {
            return res.status(400).json({ success: false, message: "Signature data is required" });
        }

        const newNDA = new NDA({
            investor: investorId,
            signatureData,
            status: 'signed',
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });

        await newNDA.save();

        await InvestorProfile.findOneAndUpdate(
            { userId: investorId },
            {
                $set: {
                    'masterNda.isSigned': true,
                    'masterNda.signedAt': new Date(),
                    'masterNda.ipAddress': req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    'masterNda.documentVersion': '1.0'
                }
            },
            { new: true }
        );

        res.status(201).json({ success: true, message: "NDA Signed Successfully" });
    } catch (err) {
        console.error("DETAILED SIGN ERROR:", err); 
        res.status(500).json({ message: err.message });
    }
});

export default router;