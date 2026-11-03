import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['link', 'pdf', 'video'], default: 'link' },
    url: { type: String, required: true },
    audience: [{ type: String, enum: ['student', 'startup'] }],
    createdAt: { type: Date, default: Date.now }
});

// Use export default here
const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;