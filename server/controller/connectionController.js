import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Send a connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { toUserId } = req.body;

    // Validate input
    if (!toUserId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Prevent self-connection
    if (senderId.toString() === toUserId) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    // Check if user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if connection already exists (in any direction)
    const existingConnection = await Connection.findOne({
      $or: [
        { from: senderId, to: toUserId },
        { from: toUserId, to: senderId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ 
        success: false, 
        message: 'Connection already exists or pending',
        status: existingConnection.status 
      });
    }

    // Create new connection request
    const newConnection = await Connection.create({
      from: senderId,
      to: toUserId,
      status: 'pending'
    });

    // Create notification for the recipient
    await Notification.create({
      recipient: toUserId,
      type: 'connection',
      title: 'New Connection Request',
      message: `${req.user.name} wants to connect with you`,
      relatedUser: senderId,
      connectionId: newConnection._id
    });

    res.status(201).json({ 
      success: true, 
      message: 'Connection request sent',
      connection: newConnection 
    });
  } catch (error) {
    console.error('sendConnectionRequest error:', error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

// Get connection status between two users
export const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { from: userId, to: targetUserId },
        { from: targetUserId, to: userId }
      ]
    });

    if (!connection) {
      return res.json({ success: true, status: 'none' });
    }

    res.json({ 
      success: true, 
      status: connection.status,
      connection: connection
    });
  } catch (error) {
    console.error('getConnectionStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    // Verify that the current user is the recipient
    if (connection.to.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Update connection status
    connection.status = 'accepted';
    await connection.save();

    // Create notification for the sender
    const senderUser = await User.findById(connection.from);
    await Notification.create({
      recipient: connection.from,
      type: 'connection',
      title: 'Connection Accepted',
      message: `${req.user.name} accepted your connection request`,
      relatedUser: userId,
      connectionId: connection._id
    });

    res.json({ 
      success: true, 
      message: 'Connection request accepted',
      connection 
    });
  } catch (error) {
    console.error('acceptConnectionRequest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    // Verify that the current user is the recipient
    if (connection.to.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Delete connection
    await Connection.findByIdAndDelete(connectionId);

    res.json({ 
      success: true, 
      message: 'Connection request rejected'
    });
  } catch (error) {
    console.error('rejectConnectionRequest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pending connection requests for current user
export const getPendingConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await Connection.find({
      to: userId,
      status: 'pending'
    }).populate('from', 'name email');

    res.json({ 
      success: true, 
      requests: pendingRequests 
    });
  } catch (error) {
    console.error('getPendingConnections error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all accepted connections for current user
export const getAcceptedConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' }
      ]
    }).populate('from', 'name email').populate('to', 'name email');

    // Transform the response to show the other user in each connection
    const transformedConnections = connections.map(conn => {
      const otherUser = conn.from._id.toString() === userId.toString() ? conn.to : conn.from;
      return {
        _id: conn._id,
        user: otherUser,
        connectedAt: conn.updatedAt
      };
    });

    res.json({ 
      success: true, 
      connections: transformedConnections 
    });
  } catch (error) {
    console.error('getAcceptedConnections error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
