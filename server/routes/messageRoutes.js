// import express from 'express';
// import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from '../controller/messageController.js';
// import { protectRoute } from '../middleware/authMiddleware.js'; 

// const messageRouter = express.Router();

// messageRouter.get('/users', protectRoute, getUsersForSidebar);
// messageRouter.get('/users/:id', protectRoute, getMessages);
// messageRouter.put('/users/mark/:id', protectRoute, markMessagesAsSeen);
// messageRouter.post('/send/:id', protectRoute, sendMessage); // Note: added :id parameter here too

// export default messageRouter;








import express from 'express';
import multer from 'multer';
import {
  askAssistantWithDocument,
  askGroqAssistant,
  getMessages,
  getUsersForSidebar,
  markMessagesAsSeen,
  sendDocumentReviewMessage,
  sendMessage,
  sendProposalMessage,
} from '../controller/messageController.js';
import { protectRoute } from '../middleware/authMiddleware.js'; 

const messageRouter = express.Router();
const memoryUpload = multer({ storage: multer.memoryStorage() });

messageRouter.get('/users', protectRoute, getUsersForSidebar);
messageRouter.get('/users/:id', protectRoute, getMessages);
messageRouter.put('/users/mark/:id', protectRoute, markMessagesAsSeen);
messageRouter.post('/assistant', protectRoute, askGroqAssistant);
messageRouter.post('/assistant-document', protectRoute, memoryUpload.single('document'), askAssistantWithDocument);
messageRouter.post('/send/:id', protectRoute, sendMessage); // Note: added :id parameter here too
messageRouter.post('/send-proposal/:id', protectRoute, sendProposalMessage);
messageRouter.post('/send-document-review/:id', protectRoute, memoryUpload.single('document'), sendDocumentReviewMessage);

export default messageRouter;