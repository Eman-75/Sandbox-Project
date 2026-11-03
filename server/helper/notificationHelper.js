import Notification from '../models/Notification.js';
import { io, userSocketMap } from '../server.js'; 

export const createNotification = async (recipientId, type, title, message) => {
  try {
    // 1. Save to Database (for history and offline users)
    const newNoti = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      unread: true
    });

    // 2. Real-time Toast via Socket.io
    // const socketId = userSocketMap[recipientId];
    const targetId = recipientId.toString(); 
    const socketId = userSocketMap[targetId];
    if (socketId) {
      // Only emit if the user is currently online
      io.to(socketId).emit("new_notification", newNoti);
    }

    return newNoti;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};