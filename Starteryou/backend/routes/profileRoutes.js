const express = require("express");
const User = require("../models/UserModel");

// Middleware
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Router setup
const router = express.Router();

// Controller functions
const getProfile = async (req, res) => {
  console.log("User ID from Token:", req.user.userId);
  try {
    const user = await User.findById(req.user.userId);
    console.log("Fetched User:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const updateProfile = async (req, res) => {
  console.log("User ID from Token:", req.user.userId);
  console.log("Request Body:", req.body);
  try {
    const { username, email, phoneNumber } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    console.log("Updated User Profile:", user);

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Routes
router.get("/getmyprofile", authenticateToken, getProfile);
router.put("/updatemyprofile", authenticateToken, updateProfile);

module.exports = router;
