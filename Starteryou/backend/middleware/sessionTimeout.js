/**
 * Middleware to manage session timeout based on user authentication status.
 *
 * - Authenticated users get a session timeout of 1 hour.
 * - Unauthenticated users get a session timeout of 15 minutes.
 * - If the session has expired, it is destroyed, and an appropriate response is sent.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const sessionTimeout = (req, res, next) => {
  // Check if user is authenticated
  const isAuthenticated = req.session && req.session.user;

  if (isAuthenticated) {
    if (req.session.cookie) {
      req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour for authenticated users
      console.log(
        "Session maxAge set for the authenticated user:",
        req.session.cookie.maxAge
      );
      console.log(
        "Session user name after authentication: ", req.session.user,
        req.session.user
      );
    }
    next();
  } else if (req.session && req.session.cookie) {
    req.session.cookie.maxAge = 15 * 60 * 1000; // 15 minutes for unauthenticated users
    console.log(
      "Session maxAge set for the unauthenticated user:",
      req.session.cookie.maxAge
    );
    console.log(
      "Session user name ( unauthenticated ): ",
      req.session.user
    );
  }

  // Check session expiry only if session and cookie exist
  if (
    req.session &&
    req.session.cookie &&
    req.session.cookie._expires &&
    new Date(req.session.cookie._expires).getTime() <= Date.now()
  ) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }
      return res.status(401).json({
        message: isAuthenticated
          ? "Session timed out, please log in again"
          : "Session timed out, please log in",
      });
    });
  } else {
    next();
  }
};

module.exports = sessionTimeout;
