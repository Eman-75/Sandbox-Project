import express from 'express';
import multer from 'multer';
import {
  getEligibleProposalRecipients,
  getReceivedProposals,
  sendProposal,
  getSentProposals,
  updateProposalStatus,
} from '../controller/proposalController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const proposalRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

proposalRouter.get('/sent', protectRoute, getSentProposals);
proposalRouter.get('/received', protectRoute, getReceivedProposals);
proposalRouter.get('/eligible-recipients', protectRoute, getEligibleProposalRecipients);
proposalRouter.post('/send', protectRoute, upload.single('document'), sendProposal);
proposalRouter.patch('/:id/status', protectRoute, updateProposalStatus);

export default proposalRouter;