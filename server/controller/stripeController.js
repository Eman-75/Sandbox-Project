import { stripe } from '../lib/stripe.js';
import User from '../models/User.js';
import Investment from '../models/Investment.js';
import Connection from '../models/Connection.js';
import mongoose from 'mongoose';

// 1. STRIPE ONBOARDING: For Students/Startups to connect their bank
export const onboardStudent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        let stripeAccountId = user.stripeAccountId;

        if (!stripeAccountId) {
            const account = await stripe.accounts.create({ type: 'express' });
            stripeAccountId = account.id;

            user.stripeAccountId = stripeAccountId;
            await user.save();
        }

        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${process.env.FRONTEND_URL}/onboard-retry`,
            return_url: `${process.env.FRONTEND_URL}/dashboard`,
            type: 'account_onboarding',
        });

        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. CREATE INVESTMENT: The 10/90 split logic for Investors
export const createInvestment = async (req, res) => {
    try {
        const { amount, startupId } = req.body; 
        const investorId = req.user._id;
        
        // Pre-generate ID to link Stripe metadata and MongoDB record
        const investmentId = new mongoose.Types.ObjectId();

        const startup = await User.findById(startupId);
        if (!startup || !startup.stripeAccountId) {
            return res.status(400).json({ message: "Startup has not set up Stripe yet." });
        }

        const adminFee = amount * 0.10; // 10% platform share
        const startupAmount = amount * 0.90; // 90% student share

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(amount * 100), // Convert to cents
                    product_data: {
                        name: `Investment for ${startup.name}`,
                        description: "Startup funding through SandBox Platform",
                    },
                },
                quantity: 1,
            }],
            payment_intent_data: {
                application_fee_amount: Math.round(adminFee * 100), 
                transfer_data: {
                    destination: startup.stripeAccountId,
                },
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                investorId: investorId.toString(),
                startupId: startupId.toString(),
                investmentId: investmentId.toString()
            }
        });

        // Create the pending record in your database
        const investment = await Investment.create({
            _id: investmentId,
            investor: investorId,
            startup: startupId,
            amount: amount,
            stripeSessionId: session.id,
            adminFee: adminFee,
            startupAmount: startupAmount,
            status: 'pending'
        });

        res.status(200).json({ url: session.url, investmentId: investment._id });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 3. WEBHOOK: Listens for Stripe success to update DB
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const updateQuery = session.metadata?.investmentId
            ? { _id: session.metadata.investmentId }
            : { stripeSessionId: session.id };

        const updatedInvestment = await Investment.findOneAndUpdate(
            updateQuery,
            { status: 'completed' },
            { new: true }
        );

        if (updatedInvestment) {
            console.log(`Investment ${updatedInvestment._id} marked as completed.`);
        } else {
            console.warn('Webhook completed but no investment matched session:', {
                investmentId: session.metadata?.investmentId,
                stripeSessionId: session.id,
            });
        }
    }

    res.json({ received: true });
};

// 4. GET CONNECTED STARTUPS: Fetches only the people you are "Accepted" with
export const getConnectedStartups = async (req, res) => {
    try {
        const investorId = req.user._id;

        const connections = await Connection.find({
            $or: [
                { from: investorId, status: 'accepted' },
                { to: investorId, status: 'accepted' }
            ]
        }).populate('from', 'name email role stripeAccountId')
          .populate('to', 'name email role stripeAccountId');

        const connectedStartups = connections
            .map(conn => {
                const otherUser = conn.from._id.toString() === investorId.toString() ? conn.to : conn.from;
                const role = otherUser.role?.toLowerCase();
                return (role === 'startup' || role === 'student') ? otherUser : null;
            })
            .filter(user => user !== null);

        res.json(connectedStartups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. GET RECEIVED INVESTMENTS: For the Startup dashboard
// stripeController.js
export const getReceivedInvestments = async (req, res) => {
    try {
        const startupId = req.user._id;

        // Fetch completed investments
        const investments = await Investment.find({ 
            startup: startupId, 
            status: 'completed' 
        })
        .populate('investor', 'name email')
        .sort({ createdAt: -1 });

        // If investments is null or undefined, default to empty array
        const safeInvestments = investments || [];

        const totalReceived = safeInvestments.reduce((sum, inv) => sum + (inv.startupAmount || 0), 0);

        res.status(200).json({
            investments: safeInvestments,
            totalReceived: totalReceived,
            totalInvestments: safeInvestments.length
        });
    } catch (error) {
        console.error('Error fetching investments:', error);
        // Even on error, send a 200 with empty data so the UI doesn't hang
        res.status(200).json({
            investments: [],
            totalReceived: 0,
            totalInvestments: 0
        });
    }
};

// stripeController.js

export const verifyInvestment = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required." });
        }

        // 1. Retrieve the actual session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // 2. Only update if the payment is actually 'paid'
        if (session.payment_status === 'paid' || session.status === 'complete') {
            const investmentLookup = session.metadata?.investmentId
                ? {
                    $or: [
                        { _id: session.metadata.investmentId },
                        { stripeSessionId: session_id },
                    ],
                  }
                : { stripeSessionId: session_id };

            const investment = await Investment.findOneAndUpdate(
                investmentLookup,
                { status: 'completed' },
                { new: true }
            );

            if (!investment) {
                console.warn('Verification succeeded with Stripe but no investment matched session:', {
                    investmentId: session.metadata?.investmentId,
                    stripeSessionId: session_id,
                });
                return res.status(404).json({
                    success: false,
                    message: "Payment was confirmed, but no matching investment record was found."
                });
            }

            return res.status(200).json({ 
                success: true, 
                message: "Payment verified and recorded!",
                investment 
            });
        }

        res.status(400).json({ success: false, message: "Payment not verified." });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const confirmInvestmentFromSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        const investorId = req.user._id;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required." });
        }

        const investment = await Investment.findOneAndUpdate(
            {
                stripeSessionId: session_id,
                investor: investorId,
            },
            { status: 'completed' },
            { new: true }
        );

        if (!investment) {
            return res.status(404).json({
                success: false,
                message: "No matching investment was found for this success redirect."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Investment marked as completed from success redirect.",
            investment,
        });
    } catch (error) {
        console.error("Success Redirect Confirmation Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// controllers/stripeController.js

export const getStripeDashboardLink = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.stripeAccountId) {
            return res.status(400).json({ message: "No Stripe account found for this user." });
        }

        // Create a login link for the Express dashboard
        const loginLink = await stripe.accounts.createLoginLink(user.stripeAccountId);

        res.status(200).json({ url: loginLink.url });
    } catch (error) {
        console.error("Stripe Dashboard Link Error:", error);
        res.status(500).json({ message: "Failed to generate dashboard link." });
    }
};


export const getSentInvestments = async (req, res) => {
    try {
        const investorId = req.user._id;

        const investments = await Investment.find({ 
            investor: investorId, 
            status: 'completed' 
        })
        .populate('startup', 'name industry') // Industry is crucial for the Pie Chart
        .sort({ createdAt: -1 });

        // Calculate dynamic allocation for the Pie Chart
        const sectorMap = {};
        investments.forEach(inv => {
            const sector = inv.startup?.industry || 'Other';
            sectorMap[sector] = (sectorMap[sector] || 0) + inv.amount;
        });

        const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);

        const allocation = Object.keys(sectorMap).map(sector => ({
            name: sector,
            value: Math.round((sectorMap[sector] / totalValue) * 100),
            color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color generator
        }));

        res.status(200).json({ investments, allocation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
