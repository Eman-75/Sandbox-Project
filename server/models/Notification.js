import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['investment', 'message', 'document', 'milestone', 'proposal', 'reminder', 'connection'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  unread: { type: Boolean, default: true },
  relatedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  connectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Connection'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);