const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({
      message: "Access token is missing or invalid",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure decoded contains userId
    console.log("Decoded User:", decoded);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    console.log("User Role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }
    next();
  };

module.exports = { authenticateToken, authorizeRoles };
