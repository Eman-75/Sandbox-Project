import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protectRoute } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import InvestorProfile from '../models/InvestorProfile.js';
import StartupProfile from '../models/StartupProfile.js';
import { signMasterNda } from '../controller/investorController.js';
import bcrypt from 'bcryptjs'; 

// Top of userRoutes.js
import Investment from '../models/Investment.js'; 
// import InvestorProfile from '../models/InvestorProfile.js';
import NDA from '../models/NDA.js';
import Connection from '../models/Connection.js';
import Message from '../models/Message.js';

const dashboardRoutes = express.Router();

dashboardRoutes.get('/investor/dashboard', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await InvestorProfile.findOne({ userId });

    const investments = await Investment.find({ investor: userId })
      .populate('startup', 'name role')
      .sort({ createdAt: -1 });

    const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalInvestments = investments.length;
    const completedDeals = investments.filter(inv => inv.status === 'completed').length;
    const pendingInvestments = investments.filter(inv => inv.status === 'pending').length;

    const uniqueStartupIds = new Set(
      investments
        .map(inv => inv.startup?._id?.toString?.() || inv.startup?.toString?.())
        .filter(Boolean)
    );

    const signedNdas = await NDA.find({
      investor: userId,
      status: 'signed',
      $or: [
        { sender: { $exists: true, $ne: null } },
        { receiver: { $exists: true, $ne: null } }
      ]
    }).select('sender receiver');

    const ndaConnectionIds = new Set();
    signedNdas.forEach((nda) => {
      [nda.sender, nda.receiver].forEach((partyId) => {
        const party = partyId?.toString?.();
        if (party && party !== userId.toString()) {
          ndaConnectionIds.add(party);
        }
      });
    });

    const acceptedConnections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' }
      ]
    }).select('from to');

    acceptedConnections.forEach((connection) => {
      [connection.from, connection.to].forEach((partyId) => {
        const party = partyId?.toString?.();
        if (party && party !== userId.toString()) {
          ndaConnectionIds.add(party);
        }
      });
    });

    const monthlyInvestmentMap = new Map(
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        .map((month) => [month, 0])
    );

    investments.forEach((investment) => {
      const monthLabel = new Date(investment.createdAt).toLocaleString('en-US', { month: 'short' });
      monthlyInvestmentMap.set(
        monthLabel,
        (monthlyInvestmentMap.get(monthLabel) || 0) + 1
      );
    });

    const statusDistribution = ['completed', 'pending', 'failed'].map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: investments.filter((investment) => investment.status === status).length
    }));

    res.json({
      stats: {
        totalInvestment,
        totalInvestments,
        completedDeals,
        pendingInvestments,
        startupsBacked: uniqueStartupIds.size,
        investmentTarget: profile?.investmentRange?.max || 0,
        totalConnections: ndaConnectionIds.size
      },
      monthlyInvestmentCounts: Array.from(monthlyInvestmentMap, ([month, count]) => ({
        month,
        count
      })),
      investmentStatusDistribution: statusDistribution,
      recentProposals: investments.slice(0, 5).map((proposal) => ({
        id: proposal._id,
        startupName: proposal.startup?.name || 'Unknown Startup',
        amount: proposal.amount,
        status: proposal.status,
        date: proposal.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching investor dashboard:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});


dashboardRoutes.get('/startup/dashboard', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StartupProfile.findOne({ userId });

    const investments = await Investment.find({ startup: userId })
      .populate('investor', 'name')
      .sort({ createdAt: -1 });

    const completedInvestments = investments.filter(inv => inv.status === 'completed');
    const pendingInvestments = investments.filter(inv => inv.status === 'pending');
    const totalFunded = completedInvestments.reduce((sum, inv) => sum + (inv.startupAmount || inv.amount || 0), 0);
    const uniqueInvestorIds = new Set(
      investments.map(inv => inv.investor?._id?.toString?.() || inv.investor?.toString?.()).filter(Boolean)
    );

    const acceptedConnections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' }
      ]
    }).populate('from', 'role _id').populate('to', 'role _id');

    const matchedInvestors = acceptedConnections.filter((connection) => {
      const otherUser = connection.from._id.toString() === userId.toString() ? connection.to : connection.from;
      return otherUser?.role === 'investor';
    }).length;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 }).populate('senderId', 'name').populate('receiverId', 'name');

    const newMessages = messages.filter(
      (msg) => msg.receiverId?._id?.toString?.() === userId.toString() && !msg.seen
    ).length;

    const profileTasks = [
      {
        title: "Company Information",
        description: "Company name, stage, amount and equity details",
        completed: Boolean(profile?.companyName && profile?.fundingStage && profile?.seekingAmount && profile?.equityOffering)
      },
      {
        title: "Pitch Deck",
        description: "Upload your startup pitch deck",
        completed: Boolean(profile?.pitchDeckUrl)
      },
      {
        title: "Business Plan",
        description: "Upload your business plan document",
        completed: Boolean(profile?.businessPlanUrl)
      },
      {
        title: "Brand Assets",
        description: "Add your company logo or profile image",
        completed: Boolean(profile?.companyLogo || profile?.profilePicture)
      }
    ];

    const completedProfileTasks = profileTasks.filter((task) => task.completed).length;
    const profileCompletion = profileTasks.length
      ? Math.round((completedProfileTasks / profileTasks.length) * 100)
      : 0;

    res.json({
      stats: {
        activeProposals: pendingInvestments.length,
        matchedInvestors,
        fundsRaised: totalFunded,
        messages: newMessages
      },
      profileCompletion,
      profileTasks,
      recentMessages: messages.slice(0, 5).map(msg => ({
        id: msg._id,
        sender: msg.senderId?._id?.toString?.() === userId.toString() ? msg.receiverId?.name : msg.senderId?.name,
        message: msg.text || 'Image message',
        date: msg.createdAt,
        read: msg.seen
      })),
      recentProposals: investments.slice(0, 5).map(inv => ({
        id: inv._id,
        investorName: inv.investor?.name || 'Unknown Investor',
        amount: inv.amount,
        status: inv.status,
        date: inv.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching startup dashboard:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

dashboardRoutes.get('/student/dashboard', protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await StudentProfile.findOne({ userId });

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 }).populate('senderId', 'name').populate('receiverId', 'name');

    const newMessages = messages.filter(
      (msg) => msg.receiverId?._id?.toString?.() === userId.toString() && !msg.seen
    ).length;

    const acceptedConnections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' }
      ]
    }).populate('from', 'role').populate('to', 'role');

    const relevantConnections = acceptedConnections.filter((connection) => {
      const otherUser = connection.from._id.toString() === userId.toString() ? connection.to : connection.from;
      return otherUser?.role === 'investor' || otherUser?.role === 'startup';
    });

    const documentCount = [
      profile?.universityCardUrl,
      profile?.resumeUrl,
      profile?.fypFileUrl
    ].filter(Boolean).length;

    const interestAreas = profile?.interestCategories?.length || 0;

    const profileTasks = [
      {
        title: "Basic Information",
        description: "Name, email, department and degree details",
        completed: Boolean(profile?.department && profile?.universityName && profile?.degreeLevel)
      },
      {
        title: "University Card",
        description: "Upload your university ID card for verification",
        completed: Boolean(profile?.universityCardUrl)
      },
      {
        title: "Resume",
        description: "Upload your resume to showcase your skills",
        completed: Boolean(profile?.resumeUrl)
      },
      {
        title: "Final Year Project",
        description: "Upload project files and documentation",
        completed: Boolean(profile?.fypFileUrl)
      }
    ];

    const completedProfileTasks = profileTasks.filter((task) => task.completed).length;
    const profileCompletion = profileTasks.length
      ? Math.round((completedProfileTasks / profileTasks.length) * 100)
      : 0;

    res.json({
      stats: {
        uploadedDocuments: documentCount,
        messages: newMessages,
        connections: relevantConnections.length,
        interestAreas
      },
      profileCompletion,
      recentMessages: messages.slice(0, 5).map(msg => ({
        id: msg._id,
        sender: msg.senderId?._id?.toString?.() === userId.toString() ? msg.receiverId?.name : msg.senderId?.name,
        message: msg.text || 'Image message',
        date: msg.createdAt,
        read: msg.seen
      })),
      profileTasks
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

export default dashboardRoutes;