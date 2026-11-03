import mongoose from 'mongoose';

const ResearchIdeasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String }, 
  pdfUrl: { type: String }, 
  summary: { type: String }, 
  extractedIdeas: [{ 
      ideaTitle: String, 
      technicalRoadmap: String, 
      marketPotential: String,   
      techStack: [String],       
      difficulty: String,
      isPublished: { type: Boolean, default: false }, 
      isRejected: { type: Boolean, default: false }     
  }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }
});

const ResearchIdeas = mongoose.model('ResearchIdeas', ResearchIdeasSchema);

export default ResearchIdeas;