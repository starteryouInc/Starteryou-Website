const express = require('express');
const sessionTimeout = require('../middleware/sessionTimeout');  // Path to sessionTimeout middleware
const router = express.Router();

// Route to check session time and login status
router.get("/session-time", sessionTimeout, (req, res) => {
  console.log('Session Cookie:', req.session.cookie); // Log the session cookie
  console.log('Session User:', req.session.user); // Log the session user
  // Check if session exists for a logged-in user
  const isAuthenticated = !!req.session.user;

  if (isAuthenticated) {
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour for logged-in user
    console.log('Session maxAge set to:', req.session.cookie.maxAge); // Log maxAge set
  }

  // Handle session cookie expiration check
  if (!req.session.cookie || !req.session.cookie._expires) {
    console.log('No expiry found, returning 0 timeRemaining'); // Log when expiry is not found
    return res.json({ timeRemaining: 0, isLoggedIn: isAuthenticated });
  }

  const remainingTime = req.session.cookie._expires 
    ? req.session.cookie._expires - Date.now() 
    : (req.session.cookie.maxAge ? req.session.cookie.maxAge : 0);

  // If remaining time is less than or equal to 0, the session has expired
  if (remainingTime <= 0) {
    console.log('Session expired, timeRemaining: 0'); // Log session expiry
    return res.json({ timeRemaining: 0, isLoggedIn: isAuthenticated });
  }

  console.log('Remaining time:', remainingTime); // Log the remaining time
  res.json({ timeRemaining: remainingTime, isLoggedIn: isAuthenticated });
});

module.exports = router;
