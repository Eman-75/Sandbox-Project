import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    equity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    stage: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
    },
    documentUrl: {
      type: String,
      trim: true,
      default: '',
    },
    documentName: {
      type: String,
      trim: true,
      default: '',
    },
    documentType: {
      type: String,
      trim: true,
      default: '',
    },
    documentSummary: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['sent', 'viewed', 'under_review', 'accepted', 'rejected'],
      default: 'sent',
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Proposal', proposalSchema);