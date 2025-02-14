const express = require('express');
const sessionTimeout = require('../middleware/sessionTimeout');  // Path to sessionTimeout middleware
const router = express.Router();

// Route to check session time and login status
router.get("/session-time", sessionTimeout, (req, res) => {
  // If session exists for a logged-in user, extend it
  if (req.session.user) {
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour for logged-in user
  }

  // Check if session expiry exists
  if (!req.session.cookie.expires) {
    return res.json({ timeRemaining: 0, isLoggedIn: false });
  }

  const remainingTime = req.session.cookie.expires - Date.now();

  // If remaining time is less than or equal to 0, the session has expired
  if (remainingTime <= 0) {
    return res.json({ timeRemaining: 0, isLoggedIn: !!req.session.user });
  }

  res.json({ timeRemaining: remainingTime, isLoggedIn: !!req.session.user });
});

module.exports = router;
