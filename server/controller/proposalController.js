import Proposal from '../models/Proposal.js';
import Connection from '../models/Connection.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';
import streamifier from 'streamifier';
import { createNotification } from '../helper/notificationHelper.js';

const proposalPopulate = [
  { path: 'investor', select: 'name role email' },
  { path: 'startup', select: 'name role email' },
];

const uploadProposalDocument = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'sandbox_proposals',
        resource_type: 'raw',
        public_id: `proposal_${Date.now()}_${(file.originalname || 'document').replace(/\s+/g, '_')}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const getEligibleProposalRecipients = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' },
      ],
    })
      .populate('from', 'name email role')
      .populate('to', 'name email role');

    const recipients = connections
      .map((conn) => (String(conn.from?._id) === String(userId) ? conn.to : conn.from))
      .filter(Boolean)
      .filter((user) => String(user._id) !== String(userId))
      .filter((user) => ['investor', 'startup'].includes(user.role));

    res.json({ success: true, recipients });
  } catch (error) {
    console.error('getEligibleProposalRecipients error', error);
    res.status(500).json({ success: false, message: 'Failed to load eligible recipients' });
  }
};

export const sendProposal = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientId, title, summary, amount, equity, stage, timeline, documentSummary } = req.body;
    const file = req.file;

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!recipientId || !title?.trim() || !summary?.trim() || !amount) {
      return res.status(400).json({
        success: false,
        message: 'recipientId, title, summary, and amount are required',
      });
    }

    if (String(recipientId) === String(senderId)) {
      return res.status(400).json({ success: false, message: 'You cannot send proposal to yourself' });
    }

    const recipient = await User.findById(recipientId).select('name role');
    if (!recipient || !['investor', 'startup'].includes(recipient.role)) {
      return res.status(400).json({ success: false, message: 'Recipient must be an investor or startup' });
    }

    const connection = await Connection.findOne({
      $or: [
        { from: senderId, to: recipientId, status: 'accepted' },
        { from: recipientId, to: senderId, status: 'accepted' },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'You must be connected with this user to send a proposal',
      });
    }

    let documentUrl = '';
    let documentName = '';
    let documentType = '';
    if (file) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only PDF, PPT, or PPTX documents are supported',
        });
      }

      const uploaded = await uploadProposalDocument(file);
      documentUrl = uploaded?.secure_url || '';
      documentName = file.originalname || '';
      documentType = file.mimetype || '';
    }

    const proposal = await Proposal.create({
      investor: senderId,
      startup: recipientId,
      title: title.trim(),
      summary: summary.trim(),
      amount: Number(amount),
      equity: Number(equity || 0),
      stage: stage?.trim?.() || '',
      timeline: timeline?.trim?.() || '',
      documentUrl,
      documentName,
      documentType,
      documentSummary: documentSummary?.trim?.() || '',
    });

    await proposal.populate(proposalPopulate);

    await createNotification(
      recipientId,
      'proposal',
      'New proposal received',
      `${req.user.name || 'A user'} sent you a proposal for "${proposal.title}".` 
    );

    res.status(201).json({ success: true, proposal });
  } catch (error) {
    console.error('sendProposal error', error);
    res.status(500).json({ success: false, message: 'Failed to send proposal' });
  }
};

export const getSentProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ investor: req.user._id })
      .populate(proposalPopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, proposals });
  } catch (error) {
    console.error('getSentProposals error', error);
    res.status(500).json({ success: false, message: 'Failed to load proposals' });
  }
};

export const getReceivedProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ startup: req.user._id })
      .populate(proposalPopulate)
      .sort({ createdAt: -1 });

    const viewedIds = proposals
      .filter((proposal) => proposal.status === 'sent')
      .map((proposal) => proposal._id);

    if (viewedIds.length) {
      await Proposal.updateMany(
        { _id: { $in: viewedIds } },
        { $set: { status: 'viewed' } }
      );
    }

    const refreshedProposals = proposals.map((proposal) => {
      if (proposal.status !== 'sent') return proposal;
      const next = proposal.toObject();
      next.status = 'viewed';
      return next;
    });

    res.json({ success: true, proposals: refreshedProposals });
  } catch (error) {
    console.error('getReceivedProposals error', error);
    res.status(500).json({ success: false, message: 'Failed to load proposals' });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['under_review', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid proposal status' });
    }

    const proposal = await Proposal.findOne({ _id: id, startup: req.user._id }).populate(proposalPopulate);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    proposal.status = status;
    proposal.respondedAt = new Date();
    await proposal.save();
    await proposal.populate(proposalPopulate);

    await createNotification(
      proposal.investor._id,
      'proposal',
      'Proposal updated',
      `${proposal.startup?.name || 'The recipient'} marked "${proposal.title}" as ${status.replace('_', ' ')}.`
    );

    res.json({ success: true, proposal });
  } catch (error) {
    console.error('updateProposalStatus error', error);
    res.status(500).json({ success: false, message: 'Failed to update proposal' });
  }
};