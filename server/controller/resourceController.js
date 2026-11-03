import Resource from '../models/Resources.js';

// GET: Fetch all resources
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ 
            success: true, 
            resources: resources || [] 
        });
    } catch (error) {
        console.error("Resource Fetch Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST: Create a new resource
export const createResource = async (req, res) => {
    try {
        const { title, description, type, url, audience } = req.body;
        
        const newResource = new Resource({
            title,
            description,
            type,
            url,
            audience
        });

        await newResource.save();
        res.status(201).json({ 
            success: true, 
            message: "Resource added successfully!", 
            resource: newResource 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE: Remove a resource
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        await Resource.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Resource deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateResource = async (req, res) => {
    try {
        // We exclude _id just in case it's still in the body
        const { _id, ...updateData } = req.body;
        
        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json(updatedResource);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: err.message || "Failed to update" });
    }
};