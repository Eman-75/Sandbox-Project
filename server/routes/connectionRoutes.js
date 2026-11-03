import express from 'express';
import {
  sendConnectionRequest,
  getConnectionStatus,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getPendingConnections,
  getAcceptedConnections
} from '../controller/connectionController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const connectionRouter = express.Router();

// Send connection request
connectionRouter.post('/send', protectRoute, sendConnectionRequest);

// Accept connection request
connectionRouter.put('/accept', protectRoute, acceptConnectionRequest);

// Reject connection request
connectionRouter.put('/reject', protectRoute, rejectConnectionRequest);

// Get all pending connection requests
connectionRouter.get('/pending', protectRoute, getPendingConnections);

// Get all accepted connections
connectionRouter.get('/accepted', protectRoute, getAcceptedConnections);

// Get connection status between two users (must be last)
connectionRouter.get('/:targetUserId', protectRoute, getConnectionStatus);

export default connectionRouter;
