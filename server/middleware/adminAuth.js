const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");
    const user = await User.findOne({ email: decodedToken.userEmail });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = {
      userEmail: decodedToken.userEmail,
      userId: user._id,
      isAdmin: user.isAdmin
    };
    
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
