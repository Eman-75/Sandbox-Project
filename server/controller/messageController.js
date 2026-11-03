// import cloudinary from "../Lib/cloudinary.js";
// import Message from "../models/Message.js";
// import User from "../models/User.js";
// import Connection from "../models/Connection.js";
// import { io, userSocketMap } from "../server.js";

// // Get all users except the logged-in user (only accepted connections)
// export const getUsersForSidebar = async (req, res) => {
//     try {
//         // req.user should have been set by protectRoute
//         if (!req.user) throw new Error('no authenticated user attached');
//         const userId = req.user._id;
        
//         // Get all accepted connections for the current user
//         const connections = await Connection.find({
//             $or: [
//                 { from: userId, status: 'accepted' },
//                 { to: userId, status: 'accepted' }
//             ]
//         }).select('from to');

//         // Extract the other user IDs from connections
//         const connectedUserIds = connections.map(conn => 
//             conn.from.toString() === userId.toString() ? conn.to : conn.from
//         );

//         // Get user details for connected users
//         const filteredUsers = await User.find({ _id: { $in: connectedUserIds } }).select('-password');

//         // Count number of messages not seen
//         const unseenMessages = {};
//         const promises = filteredUsers.map(async (user) => {
//             const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false});
//             if (messages.length > 0) {
//                 unseenMessages[user._id] = messages.length;
//             }
//         })
//         await Promise.all(promises);
//         res.json({ success: true, users: filteredUsers, unseenMessages });
//     }
//     catch (error) {
//         console.log('getUsersForSidebar error', error);
//         res.status(500).json({ success: false, message: error.message || 'Failed to load users' });
//     }
// };

// // Get all messages for selected user

// export const getMessages = async (req, res) => {
//     try {
//         const {id : selectedUserId} = req.params;
//         const myId = req.user._id;

//         // Verify connection exists between users
//         const connection = await Connection.findOne({
//             $or: [
//                 { from: myId, to: selectedUserId, status: 'accepted' },
//                 { from: selectedUserId, to: myId, status: 'accepted' }
//             ]
//         });

//         if (!connection) {
//             return res.status(403).json({ 
//                 success: false, 
//                 message: 'You must be connected with this user to view messages' 
//             });
//         }

//         const messages = await Message.find({
//             $or: [
//                 { senderId: myId, receiverId: selectedUserId },
//                 { senderId: selectedUserId, receiverId: myId }
//             ]
//         })
        
//         const result = await Message.updateMany(
//           { senderId: selectedUserId, receiverId: myId },
//           { seen: true }
//         );
//         // notify the other user (the sender of those messages) that they have been seen
//         if (result.modifiedCount > 0) {
//           const seenMsgs = await Message.find({
//             senderId: selectedUserId,
//             receiverId: myId,
//             seen: true
//           }).select('_id');
//           const senderSocketId = userSocketMap[selectedUserId];
//           if (senderSocketId) {
//             io.to(senderSocketId).emit('messagesSeen', seenMsgs.map(m => m._id));
//           }
//         }

//         res.json({ success: true, messages });
//     }
//     catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: 'Failed to load messages' });
//     }
// };

// // Api to mark messages as seen

// export const markMessagesAsSeen = async (req, res) => {
//     try {
//         const {id} = req.params;
//         await Message.findByIdAndUpdate(id, { seen: true });
//         res.json({success: true});
//     }
//     catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: 'Something went wrong' });
//     }
// };

// // Send message to selected user

// export const sendMessage = async (req, res)=>{
//     try {
//         const {text, image} = req.body;
//         const receiverId = req.params.id;
//         const senderId = req.user._id;

//         // Verify connection exists between sender and receiver
//         const connection = await Connection.findOne({
//             $or: [
//                 { from: senderId, to: receiverId, status: 'accepted' },
//                 { from: receiverId, to: senderId, status: 'accepted' }
//             ]
//         });

//         if (!connection) {
//             return res.status(403).json({ 
//                 success: false, 
//                 message: 'You must be connected with this user to send messages' 
//             });
//         }

//         let imageUrl = '';
//         if(image){
//             const uploadResponse = await cloudinary.uploader.upload(image, {
//                 folder: 'Sandbox_messages',
//                 resource_type: 'image',
//             });
//             imageUrl = uploadResponse.secure_url;
//         }
//         const newMessage = await Message.create({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl,
            
//         });

//         // Emit new message to receiver if online

//         const receiverSocketId = userSocketMap[receiverId];
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         // respond with consistent key so client can append
//         res.json({ success: true, newMessage });
//     }
//     catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: 'Something went wrong' });
//     }
// };











import OpenAI from 'openai';
import PDFParser from 'pdf2json';
import cloudinary from '../lib/cloudinary.js';
import { createNotification } from '../helper/notificationHelper.js';
import Connection from '../models/Connection.js';
import Message from '../models/Message.js';
import Proposal from '../models/Proposal.js';
import User from '../models/User.js';
import { io, userSocketMap } from '../server.js';

let groqClient = null;
let groqClientKey = '';

const getGroqClient = () => {
  const key = (process.env.GROQ_API_KEY || '').trim();
  if (!key) return null;

  if (groqClient && groqClientKey === key) {
    return groqClient;
  }

  groqClient = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  groqClientKey = key;
  return groqClient;
};

const messagePopulate = {
  path: 'proposalId',
  populate: [
    { path: 'investor', select: 'name role email' },
    { path: 'startup', select: 'name role email' },
  ],
};

const normalizeMessage = (messageDoc) => {
  const message = messageDoc?.toObject ? messageDoc.toObject() : messageDoc;
  if (!message) return message;

  if (message.senderId?._id) message.senderId = message.senderId._id;
  if (message.receiverId?._id) message.receiverId = message.receiverId._id;

  return message;
};

const ensureConnection = async (senderId, receiverId) => {
  return Connection.findOne({
    $or: [
      { from: senderId, to: receiverId, status: 'accepted' },
      { from: receiverId, to: senderId, status: 'accepted' },
    ],
  });
};

const buildFallbackReview = ({ fileName, fileType, description, extractedText }) => {
  const source = (extractedText || description || '').trim();
  const hasSource = source.length > 0;
  const assumptions = hasSource
    ? ''
    : 'Assumption: detailed document text was not available, so feedback is based on general pitch/proposal standards.';

  return [
    'Enhancements',
    '- Clarify the core problem and who faces it most urgently.',
    '- Add one clear value proposition sentence near the top.',
    '- Include measurable traction (users, revenue, pilots, retention, or outcomes).',
    '- Tighten the ask: exact amount, use of funds, and expected milestone timeline.',
    '- Improve visual hierarchy and keep each slide/section focused on one idea.',
    '',
    'Mistakes / Risks',
    '- Generic claims without data reduce investor/client trust.',
    '- Missing go-to-market plan makes execution risk look high.',
    '- Financial assumptions are often not tied to realistic growth drivers.',
    '- Competitive positioning may be unclear if alternatives are not compared directly.',
    '- Inconsistent formatting can make the document look less professional.',
    '',
    'Client Message',
    `I reviewed "${fileName}" (${fileType}) and identified key improvements to strengthen clarity, credibility, and decision-readiness. I also highlighted the main risks that could reduce impact with investors or stakeholders. I can now help you apply these updates section-by-section to produce a sharper final version for submission.,
    assumptions`,
  ]
    .filter(Boolean)
    .join('\n');
};

const extractPdfText = async (buffer) => {
  const pdfParser = new PDFParser(null, 1);
  const extractedText = await new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (err) => reject(err.parserError || err));
    pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent() || ''));
    pdfParser.parseBuffer(buffer);
  });
  return extractedText;
};

const buildAssistantFallbackReply = (prompt = '') => {
  return `I can still help even without GROQ_API_KEY configured on the server.

Here is practical guidance for your request:
${prompt ? `- Your request: ${prompt}` : '- Please share your objective in one sentence.'}
- I can review pitch/proposal structure, risks, and wording.
- I can generate client-ready feedback format (enhancements, mistakes, next steps).
- I can also review uploaded PDF/PPT/PPTX documents in this chat.

To enable full LLM answers, add GROQ_API_KEY in server/.env and restart the backend.`;
};

const generateDocumentReview = async ({ file, description = '' }) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  if (!file) {
    return { error: 'Please upload a PDF, PPT, or PPTX document' };
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { error: 'Only PDF, PPT, or PPTX files are supported' };
  }

  let extractedText = '';
  if (file.mimetype === 'application/pdf') {
    extractedText = await extractPdfText(file.buffer);
  }

  const sanitizedDescription = description.trim();
  if (!sanitizedDescription && !extractedText.trim()) {
    return { error: 'Add a short description for AI review when document text is unavailable' };
  }

  const reviewPrompt = `
You are SandBox AI. Analyze the uploaded business document and return a practical client-facing review.

Output format:
1) "Enhancements" with 4-8 concise bullets.
2) "Mistakes / Risks" with 4-8 concise bullets.
3) "Client Message" with a short polished paragraph ready to send.

Constraints:
- Keep feedback specific and actionable.
- If document text is missing (common for PPT/PPTX extraction limits), rely on the user description and explicitly say assumptions were made.
- Avoid markdown tables.

Document meta:
- File name: ${file.originalname}
- File type: ${file.mimetype}

User description:
${sanitizedDescription || 'No extra description provided.'}

Extracted document text (may be empty for PPT/PPTX):
${(extractedText || '').slice(0, 14000)}
`;

  let aiReview = '';
  const activeGroqClient = getGroqClient();
  if (activeGroqClient) {
    const completion = await activeGroqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise business document reviewer for investors, startups, and students. Keep output structured and client-ready.',
        },
        { role: 'user', content: reviewPrompt },
      ],
    });
    aiReview = completion.choices?.[0]?.message?.content?.trim() || '';
  }

  if (!aiReview) {
    aiReview = buildFallbackReview({
      fileName: file.originalname,
      fileType: file.mimetype,
      description: sanitizedDescription,
      extractedText,
    });
  }

  return { review: aiReview };
};

const emitMessageToReceiver = (receiverId, message) => {
  const receiverSocketId = userSocketMap[receiverId.toString()];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', message);
  }
};

// Get all users except the logged-in user (only accepted connections)
export const getUsersForSidebar = async (req, res) => {
  try {
    if (!req.user) throw new Error('no authenticated user attached');
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [
        { from: userId, status: 'accepted' },
        { to: userId, status: 'accepted' },
      ],
    }).select('from to');

    const connectedUserIds = connections.map((conn) =>
      conn.from.toString() === userId.toString() ? conn.to : conn.from
    );

    const filteredUsers = await User.find({ _id: { $in: connectedUserIds } }).select('-password');

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log('getUsersForSidebar error', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to load users' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const connection = await ensureConnection(myId, selectedUserId);
    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'You must be connected with this user to view messages',
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    })
      .populate(messagePopulate)
      .sort({ createdAt: 1 });

    const result = await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    if (result.modifiedCount > 0) {
      const seenMsgs = await Message.find({
        senderId: selectedUserId,
        receiverId: myId,
        seen: true,
      }).select('_id');

      const senderSocketId = userSocketMap[selectedUserId];
      if (senderSocketId) {
        io.to(senderSocketId).emit('messagesSeen', seenMsgs.map((m) => m._id));
      }
    }

    res.json({ success: true, messages: messages.map(normalizeMessage) });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: 'Failed to load messages' });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: 'Something went wrong' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text?.trim() && !image) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const connection = await ensureConnection(senderId, receiverId);
    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'You must be connected with this user to send messages',
      });
    }

    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'Sandbox_messages',
        resource_type: 'image',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessageDoc = await Message.create({
      senderId,
      receiverId,
      messageType: 'text',
      text: text?.trim?.() || '',
      image: imageUrl,
    });

    const newMessage = normalizeMessage(newMessageDoc);
    emitMessageToReceiver(receiverId, newMessage);

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: 'Something went wrong' });
  }
};

export const sendProposalMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const { title, summary, amount, equity, stage, timeline } = req.body;

    const receiver = await User.findById(receiverId).select('name role');
    if (!receiver || !['investor', 'startup', 'student'].includes(receiver.role)) {
      return res.status(400).json({ success: false, message: 'Proposals can only be sent to investor, startup, or student accounts' });
    }

    if (String(receiverId) === String(senderId)) {
      return res.status(400).json({ success: false, message: 'You cannot send a proposal to yourself' });
    }

    const connection = await ensureConnection(senderId, receiverId);
    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'You must be connected with this startup to send a proposal',
      });
    }

    if (!title?.trim() || !summary?.trim() || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Title, summary, and amount are required',
      });
    }

    const proposal = await Proposal.create({
      investor: senderId,
      startup: receiverId,
      title: title.trim(),
      summary: summary.trim(),
      amount: Number(amount),
      equity: Number(equity || 0),
      stage: stage?.trim?.() || '',
      timeline: timeline?.trim?.() || '',
    });

    await proposal.populate(messagePopulate.populate);

    const messageDoc = await Message.create({
      senderId,
      receiverId,
      messageType: 'proposal',
      text: `Proposal: ${proposal.title}`,
      proposalId: proposal._id,
    });

    const populatedMessageDoc = await Message.findById(messageDoc._id).populate(messagePopulate);
    const newMessage = normalizeMessage(populatedMessageDoc);

    emitMessageToReceiver(receiverId, newMessage);

    await createNotification(
      receiverId,
      'proposal',
      'New proposal received',
      `${req.user.name || 'A user'} sent you a proposal for ${proposal.title}.`
    );

    res.json({ success: true, newMessage, proposal });
  } catch (error) {
    console.error('sendProposalMessage error', error);
    res.status(500).json({ success: false, message: 'Failed to send proposal' });
  }
};

export const sendDocumentReviewMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const { description = '' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF, PPT, or PPTX document' });
    }

    const receiver = await User.findById(receiverId).select('name role');
    if (!receiver || !['investor', 'startup', 'student'].includes(receiver.role)) {
      return res.status(400).json({ success: false, message: 'Document review can only be sent to investor, startup, or student accounts' });
    }

    if (String(receiverId) === String(senderId)) {
      return res.status(400).json({ success: false, message: 'You cannot send a review message to yourself' });
    }

    const connection = await ensureConnection(senderId, receiverId);
    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'You must be connected with this user to send document review feedback',
      });
    }

    const reviewResult = await generateDocumentReview({ file, description });
    if (reviewResult.error) {
      return res.status(400).json({ success: false, message: reviewResult.error });
    }
    const aiReview = reviewResult.review;

    const messageText = `Document Review: ${file.originalname}\n\n${aiReview}`;

    const newMessageDoc = await Message.create({
      senderId,
      receiverId,
      messageType: 'text',
      text: messageText,
    });

    const newMessage = normalizeMessage(newMessageDoc);
    emitMessageToReceiver(receiverId, newMessage);

    await createNotification(
      receiverId,
      'message',
      'New AI document review',
      `${req.user.name || 'A user'} shared an AI-reviewed document feedback message.`
    );

    return res.json({ success: true, newMessage, review: aiReview });
  } catch (error) {
    console.error('sendDocumentReviewMessage error', error);
    return res.status(500).json({ success: false, message: 'Failed to send document review' });
  }
};

export const askGroqAssistant = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    if (!prompt?.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const activeGroqClient = getGroqClient();
    if (!activeGroqClient) {
      return res.json({ success: true, reply: buildAssistantFallbackReply(prompt.trim()) });
    }

    const completion = await activeGroqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are SandBox AI, a concise assistant for founders, investors, and students. Help with proposals, fundraising, networking, research, and platform workflows. Keep answers practical and structured.',
        },
        ...history
          .filter((item) => ['user', 'assistant'].includes(item.role) && item.content)
          .slice(-10),
        { role: 'user', content: prompt.trim() },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.json({ success: true, reply: reply || 'I was not able to generate a reply.' });
  } catch (error) {
    console.error('askGroqAssistant error', error);
    res.status(500).json({ success: false, message: 'Groq chat request failed' });
  }
};

export const askAssistantWithDocument = async (req, res) => {
  try {
    const { description = '' } = req.body;
    const reviewResult = await generateDocumentReview({ file: req.file, description });

    if (reviewResult.error) {
      return res.status(400).json({ success: false, message: reviewResult.error });
    }

    return res.json({ success: true, reply: reviewResult.review });
  } catch (error) {
    console.error('askAssistantWithDocument error', error);
    return res.status(500).json({ success: false, message: 'Document review failed' });
  }
};