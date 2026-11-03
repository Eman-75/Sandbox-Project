import express from 'express';
const router = express.Router();
import {
  onboardStudent,
  createInvestment,
  handleStripeWebhook,
  getConnectedStartups,
  getReceivedInvestments,
  getStripeDashboardLink,
  getSentInvestments,
  verifyInvestment,
  confirmInvestmentFromSuccess,
} from '../controller/stripeController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

router.post('/onboard', protectRoute, onboardStudent);
router.post('/invest', protectRoute, createInvestment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.get('/connected-startups', protectRoute, getConnectedStartups);
router.get('/investments', protectRoute, getReceivedInvestments);
router.get('/dashboard-link', protectRoute, getStripeDashboardLink);
router.get('/sent-investments', protectRoute, getSentInvestments); // Alias for investments history
router.get('/verify-payment', protectRoute, verifyInvestment);
router.post('/confirm-success', protectRoute, confirmInvestmentFromSuccess);

export default router;
