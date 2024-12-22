const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
console.log("JWT_SECRET: ", process.env.JWT_SECRET);
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token is missing or invalid",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
      });
    }
    next();
  };
module.exports = { authenticateToken, authorizeRoles };
