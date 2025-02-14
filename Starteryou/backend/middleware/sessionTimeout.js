const sessionTimeout = (req, res, next) => {
  // Check if user is authenticated
  const isAuthenticated = req.session && req.session.user;

  if (isAuthenticated) {
    // For authenticated users, set session timeout to 1 hour (3600000 ms)
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour
  } else {
    // For unauthenticated users, set session timeout to 15 minutes (900000 ms)
    req.session.cookie.maxAge = 15 * 60 * 1000; // 15 minutes
  }

  // Check if the session has expired
  if (req.session.cookie.expires && req.session.cookie.expires <= Date.now()) {
    // If session is expired
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      
      // Return a different message based on whether the user was logged in or not
      if (isAuthenticated) {
        return res.status(401).json({ message: 'Session timed out, please log in again' });
      } else {
        return res.status(401).json({ message: 'Session timed out, please log in' });
      }
    });
  } else {
    // If session is still active, continue to the next middleware/route
    next();
  }
};

module.exports = sessionTimeout;
