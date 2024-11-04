// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login route
router.post("/login", async (req, res) => {
  try {
    const {username, password} = req.body;

    // Find user
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Create JWT token
    const token = jwt.sign(
      {userId: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({message: "Server error"});
  }
});

module.exports = router;
