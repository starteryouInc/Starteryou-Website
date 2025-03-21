/**
 * Express router for handling session time and login status.
 *
 * This route checks the remaining session time and the user's authentication status.
 *
 * @module routes/sessionTime
 */

const express = require("express");
const sessionTimeout = require("../middleware/sessionTimeout"); // Path to sessionTimeout middleware
const router = express.Router();
const logger = require("../utils/logger"); // Logger import

/**
 * Route to check session time and login status.
 *
 * @name GET /session-time
 * @function
 * @memberof module:routes/sessionTime
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get("/session-time", sessionTimeout, (req, res) => {
  logger.info("Session Cookie:", req.session.cookie); // Log the session cookie
  logger.info("Session User:", req.session.user); // Log the session user
  // Check if session exists for a logged-in user
  const isAuthenticated = !!req.session.user;

  if (isAuthenticated) {
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour for logged-in user
    logger.info("Session maxAge set to:", req.session.cookie.maxAge); // Log maxAge set
  }

  // Handle session cookie expiration check
  if (!req.session.cookie || !req.session.cookie._expires) {
    logger.info("No expiry found, returning 0 timeRemaining"); // Log when expiry is not found
    return res.json({ timeRemaining: 0, isLoggedIn: isAuthenticated });
  }

  const remainingTime = req.session.cookie._expires
    ? req.session.cookie._expires - Date.now()
    : req.session.cookie.maxAge
    ? req.session.cookie.maxAge
    : 0;

  // If remaining time is less than or equal to 0, the session has expired
  if (remainingTime <= 0) {
    logger.info("Session expired, timeRemaining: 0"); // Log session expiry
    return res.json({ timeRemaining: 0, isLoggedIn: isAuthenticated });
  }

  logger.info("Remaining time:", remainingTime); // Log the remaining time
  res.json({ timeRemaining: remainingTime, isLoggedIn: isAuthenticated });
});

module.exports = router;
