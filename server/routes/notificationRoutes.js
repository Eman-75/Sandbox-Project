// import express from 'express';
// import Notification from '../models/Notification.js';
// import { protectRoute } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // 1. Get notifications for the logged-in user
// router.get('/', protectRoute, async (req, res) => {
//   try {
//     // req.user.userId comes from your protectRoute middleware
//     const notifications = await Notification.find({ recipient: req.user.userId })
//       .sort({ createdAt: -1 }); // Newest first
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching notifications" });
//   }
// });

// // 2. Mark a specific notification as read
// router.patch('/:id/read', protectRoute, async (req, res) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, { unread: false });
//     res.json({ message: "Marked as read" });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating notification" });
//   }
// });

// // 3. Delete a notification
// router.delete('/:id', protectRoute, async (req, res) => {
//   try {
//     await Notification.findByIdAndDelete(req.params.id);
//     res.json({ message: "Notification deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting notification" });
//   }
// });

// export default router;

import express from 'express';
import Notification from '../models/Notification.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for logged-in user
// backend/routes/notificationRoutes.js
router.get("/", protectRoute, async (req, res) => {
    try {
        // Use req.user._id because your middleware sets req.user
        const notifications = await Notification.find({ 
            recipient: req.user._id 
        }).sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Mark all as read
// backend/routes/notificationRoutes.js
router.put("/mark-all-read", protectRoute, async (req, res) => {
  try {
    // Update all unread notifications for the logged-in user
    await Notification.updateMany(
      { recipient: req.user._id, unread: true },
      { $set: { unread: false } }
    );
    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

// 1. Mark a specific notification as read
// Changed from .patch to .put to match your frontend axios call
router.put('/:id/read', protectRoute, async (req, res) => {
  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id }, // Ensure user owns it
      { unread: false },
      { new: true }
    );
    
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// 2. Delete a specific notification
router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const deletedNotification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id // Security: Ensure user owns it
    });

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

router.get("/history", protectRoute, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('connectionId', 'status'); // Populate connection status
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
});

export default router;