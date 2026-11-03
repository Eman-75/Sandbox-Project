import express from 'express';
import multer from 'multer';
import { uploadAndAnalyzeResearch } from '../controller/researchController.js';
import ResearchIdeas from '../models/ResearchIdeas.js';

const router = express.Router();

// Setup memory storage (keeps file in RAM for quick AI processing)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"), false);
    }
  }
});

// The Route: Admin posts to this
// 'pdf' is the key name you'll use in your FormData on the frontend
router.post('/upload-research', upload.single('pdf'), uploadAndAnalyzeResearch);
// In your research router file
router.get('/all-research', async (req, res) => {
  try {
    // We added .lean() and .sort() for better performance and UX
    const research = await ResearchIdeas.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ 
      success: true, 
      data: research || [] 
    });
  } catch (error) {
    // Check your terminal (the black window running node) to see this output!
    console.error("Database Fetch Error:", error); 
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT: Update a specific idea inside a research document
router.put('/update-idea/:paperId/:ideaId', async (req, res) => {
  try {
    const { paperId, ideaId } = req.params;
    const updateData = req.body; // e.g., { ideaTitle: "New Title", technicalRoadmap: "..." }

    const updatedPaper = await ResearchIdeas.findOneAndUpdate(
      { _id: paperId, "extractedIdeas._id": ideaId },
      { $set: { "extractedIdeas.$": { ...updateData, _id: ideaId } } },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedPaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH: Toggle Published Status
router.patch('/toggle-publish/:paperId/:ideaId', async (req, res) => {
  try {
    const { paperId, ideaId } = req.params;
    
    // First, find the current state
    const paper = await ResearchIdeas.findById(paperId);
    const idea = paper.extractedIdeas.id(ideaId);
    
    // Toggle the boolean
    idea.isPublished = !idea.isPublished;
    await paper.save();

    res.status(200).json({ success: true, isPublished: idea.isPublished });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Remove an idea from a paper
router.delete('/delete-idea/:paperId/:ideaId', async (req, res) => {
  try {
    const { paperId, ideaId } = req.params;
    await ResearchIdeas.findByIdAndUpdate(paperId, {
      $pull: { extractedIdeas: { _id: ideaId } }
    });
    res.status(200).json({ success: true, message: "Idea deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;