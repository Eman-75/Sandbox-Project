// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import authRoutes from './routes/auth.js'; 
// import messageRouter from './routes/messageRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import researchRoutes from './routes/researchRoutes.js'
// import notificationRoutes from './routes/notificationRoutes.js';
// import ndaRoutes from './routes/ndaRoutes.js';
// import resourceRoutes from './routes/resourceRoutes.js';
// import connectionRouter from './routes/connectionRoutes.js';
// import stripeRoutes from './routes/stripeRoutes.js';
// import {Server} from 'socket.io';
// import { createServer } from 'http';

// dotenv.config();
// const app = express();

// const httpServer = createServer(app);

// // Initialize socket.io server
// export const io = new Server(httpServer, {
//     cors: {
//         origin: 'http://localhost:5173', // Change from '*'
//         credentials: true
//     },
// });

// // Store online users
// export const userSocketMap = {};

// //Socket.io connection handler
// io.on("connection", (socket)=>{
//   const userId = socket.handshake.query.userId;
//   // console.log(`User connected: ${userId}`);

//   if(userId){
//     userSocketMap[userId] = socket.id;
//   }

//   // Emit online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   socket.on("disconnect", () => {
//     // console.log(`User disconnected: ${userId}`);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// })

// // Middleware
// // app.use(express.json());
// app.use(express.json({ limit: '50mb' })); 
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(
//   cors({
//     // Replace '*' with your frontend URL (usually localhost:5173 for Vite)
//     origin: 'http://localhost:5173', 
//     allowedHeaders: ['Content-Type', 'Authorization', 'token'],
//     credentials: true
//   })
// );

// // Routes
// // Mount specific routes FIRST (before generic routes)
// app.use('/api/stripe', stripeRoutes);
// app.use('/api/connections', connectionRouter);
// app.use('/api/resources', resourceRoutes);
// app.use('/api/nda', ndaRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/research', researchRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRouter);
// app.use('/api', authRoutes); 

// // Database connection
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log('✅ Connected to SandBox DB'))
//   .catch(err => console.log(err));

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));






































import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'; 
import messageRouter from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import researchRoutes from './routes/researchRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js';
import ndaRoutes from './routes/ndaRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import connectionRouter from './routes/connectionRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import { handleStripeWebhook } from './controller/stripeController.js'; // Import the webhook specifically
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize socket.io server
export const io = new Server(httpServer, {
    cors: {
        origin: frontendUrl,
        credentials: true
    },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// --- CRITICAL ORDERING FOR STRIPE WEBHOOK ---
// This MUST come before express.json()
app.post(
    '/api/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    handleStripeWebhook
);

// General Middleware
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        origin: frontendUrl,
        allowedHeaders: ['Content-Type', 'Authorization', 'token', 'stripe-signature'], // Added stripe-signature
        credentials: true
    })
);

// Routes
app.use('/api/proposals', proposalRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/stripe', stripeRoutes);
app.use('/api/connections', connectionRouter);
app.use('/api/resources', resourceRoutes);
app.use('/api/nda', ndaRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRouter);
app.use('/api', authRoutes); 

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Connected to SandBox DB'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.get('/health/db', (_req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        status: connected ? 'ok' : 'unavailable',
        database: connected ? 'connected' : 'not connected',
    });
});

httpServer.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));