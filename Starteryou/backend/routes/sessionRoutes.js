const express = require("express");
const sessionTimeout = require("../middleware/sessionTimeout"); // Path to sessionTimeout middleware
const router = express.Router();
const logger = require("../utils/logger"); // Logger import

/**
 * Route to check session time and login status.
 *
 * This route checks the remaining session time and the user's authentication status.
 *
 * @name GET /session-time
 * @function
 * @memberof module:routes/sessionTime
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get("/session-time", sessionTimeout, (req, res) => {
  console.log("Session data after route & middleware hits:", req.session);
  console.log("Session user:", req.session.user);
  console.log("Session cookie:", req.session.cookie);
  logger.info(`Session Cookie: ${JSON.stringify(req.session.cookie)}`);
  logger.info(`Session User: ${JSON.stringify(req.session.user)}`);

  // Check if session exists for a logged-in user
  const isAuthenticated = !!req.session.user;

  if (isAuthenticated) {
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour for logged-in users
    console.log("Session maxAge updated for the authenticated user:", req.session.cookie.maxAge);
  }

  if (!req.session.cookie || !req.session.cookie._expires) {
    logger.info("No expiry found, returning 0 timeRemaining");
    return res.json({ timeRemaining: 0, isLoggedIn: isAuthenticated });
  }

  // Ensure `_expires` is converted to timestamp
  const remainingTime = new Date(req.session.cookie._expires).getTime() - Date.now();

  if (remainingTime <= 0) {
    logger.info("Session expired, timeRemaining: 0");
    return res.json({ timeRemaining: 0, isLoggedIn: false });
  }

  logger.info(`Remaining time: ${remainingTime}ms`);

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.json({ timeRemaining: remainingTime, isLoggedIn: isAuthenticated });
});

module.exports = router;
