export const signMasterNda = async (req, res) => {
  try {
    // req.user.id comes from your auth middleware
    const updatedProfile = await InvestorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { 
        $set: { 
          'masterNda.isSigned': true, 
          'masterNda.signedAt': new Date(),
          'masterNda.ipAddress': req.ip || req.headers['x-forwarded-for'],
          'masterNda.documentVersion': "1.0"
        } 
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Investor profile not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "NDA Signed", 
      data: updatedProfile.masterNda 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};