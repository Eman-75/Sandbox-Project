import jwt from "jsonwebtoken";
import User from "../models/User.js";

// server/middleware/authMiddleware.js
export const protectRoute = async (req, res, next) => {
  try {
    // read token from cookie or headers
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.split(" ")[1] || // prefer Bearer
      req.headers.token;                           // fallback legacy header


    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // tolerate both payload formats (id vs userId)
    const userId = decoded.userId || decoded.id;

    // 3. Find the user and attach to the request
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Now req.user._id will work in your controller!
    next();
  } catch (error) {
    console.log("Error in middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};