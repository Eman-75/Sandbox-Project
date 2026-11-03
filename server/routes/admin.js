import express from "express";
import User from "../models/User.js";
import { requireRole, verifyToken } from "../middleware/auth.js";

const router = express.Router();

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (day > 0) return `${day} day${day === 1 ? "" : "s"} ago`;
  if (hr > 0) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  if (min > 0) return `${min} minute${min === 1 ? "" : "s"} ago`;
  return "just now";
}

function monthLabel(d) {
  return new Date(d).toLocaleString("en-US", { month: "short" });
}

function lastNMonths(n = 6) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }
  return months;
}

// DEBUG: Check current user info
router.get("/admin/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user, decodedToken: req.user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info", error: err.message });
  }
});

router.get("/admin/dashboard", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    // --- Stats ---
    const [totalUsers, pendingVerifications] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: { $ne: "admin" }, isVerified: false }),
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({
      role: { $ne: "admin" },
      createdAt: { $gte: startOfMonth },
    });

    // --- Distribution (counts) ---
    const roleCountsAgg = await User.aggregate([
      { $match: { role: { $ne: "admin" } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const roleCounts = roleCountsAgg.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    // --- Growth (last 6 months users; deals placeholder = 0) ---
    const months = lastNMonths(6);
    const start = months[0];
    const end = new Date(months[months.length - 1].getFullYear(), months[months.length - 1].getMonth() + 1, 1);

    const perMonthAgg = await User.aggregate([
      { $match: { role: { $ne: "admin" }, createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          users: { $sum: 1 },
        },
      },
    ]);
    const perMonthMap = perMonthAgg.reduce((acc, r) => {
      acc[r._id] = r.users;
      return acc;
    }, {});
    const growth = months.map((m) => {
      const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
      return { month: monthLabel(m), users: perMonthMap[key] || 0, deals: 0 };
    });

    // --- Verification Queue (latest 3 unverified users) ---
    const queueUsers = await User.find({ role: { $ne: "admin" }, isVerified: false })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name email role createdAt");
    const verificationQueue = queueUsers.map((u) => ({
      id: u._id,
      name: u.name,
      tag: u.role?.charAt(0).toUpperCase() + u.role?.slice(1),
      email: u.email,
      time: timeAgo(u.createdAt),
    }));

    // --- Recent Activity (last 4 events from user registrations + verifications) ---
    const [recentRegs, recentVerified] = await Promise.all([
      User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).limit(3).select("name role createdAt"),
      User.find({ role: { $ne: "admin" }, isVerified: true }).sort({ updatedAt: -1 }).limit(3).select("name role updatedAt"),
    ]);

    const events = [
      ...recentRegs.map((u) => ({
        at: u.createdAt,
        title: "New user registration",
        subtitle: u.name,
        tag: u.role?.charAt(0).toUpperCase() + u.role?.slice(1),
      })),
      ...recentVerified.map((u) => ({
        at: u.updatedAt,
        title: "Profile verification completed",
        subtitle: u.name,
        tag: u.role?.charAt(0).toUpperCase() + u.role?.slice(1),
      })),
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 4)
      .map((e) => ({ title: e.title, subtitle: e.subtitle, tag: e.tag, time: timeAgo(e.at) }));

    return res.status(200).json({
      stats: {
        totalUsers,
        newUsersThisMonth: newThisMonth,
        pendingVerifications,
        activeDeals: 0,
        reportedIssues: 0,
      },
      distribution: {
        startup: roleCounts.startup || 0,
        investor: roleCounts.investor || 0,
        student: roleCounts.student || 0,
      },
      growth,
      verificationQueue,
      recentActivity: events,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load admin dashboard", error: err.message });
  }
});

// APPROVE USER VERIFICATION
router.patch("/admin/users/:id/approve", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    console.log("Approve endpoint hit with userId:", req.params.id);
    console.log("Admin user:", req.user);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      console.log("User not found:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User approved successfully:", user.name);
    res.status(200).json({ message: "User approved successfully", user });
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ message: "Error approving user", error: err.message });
  }
});

// REJECT USER VERIFICATION
router.patch("/admin/users/:id/reject", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    console.log("Reject endpoint hit with userId:", req.params.id);
    console.log("Admin user:", req.user);
    
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isVerified: false,
        rejectionReason: reason || "Rejected by admin"
      },
      { new: true }
    ).select("-password");

    if (!user) {
      console.log("User not found:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User rejected successfully:", user.name);
    res.status(200).json({ message: "User rejected successfully", user });
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ message: "Error rejecting user", error: err.message });
  }
});

// APPROVE USER (set isVerified = true)
router.patch(
  "/admin/users/:id/approve",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { isVerified: true } },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(updated);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to approve user", error: err.message });
    }
  }
);

// REJECT USER (delete user for now)
router.patch(
  "/admin/users/:id/reject",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id).select(
        "-password"
      );

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User rejected and removed", user: deleted });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to reject user", error: err.message });
    }
  }
);

export default router;

