import NDA from '../models/NDA'; // Ensure this path matches your model name

export const getNDAStatus = async (req, res) => {
    try {
        const { userId } = req.params; // The ID of the user you are chatting with
        const currentUserId = req.user._id; // Your ID (from auth middleware)

        // Find a signed NDA where either:
        // 1. You sent it and they received it
        // 2. They sent it and you received it
        const nda = await NDA.findOne({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ],
            status: 'signed'
        });

        if (nda) {
            // We send 'nda' here so the frontend gets 'signatureData'
            return res.json({ 
                isSigned: true, 
                nda: nda 
            });
        }

        // If no NDA found, tell the frontend it's not signed
        res.json({ isSigned: false });
    } catch (error) {
        console.error("Error fetching NDA status:", error);
        res.status(500).json({ message: "Server error fetching NDA status" });
    }
};