const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate users using JWT.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {void} Sends a response if authentication fails or calls `next()` if successful.
 */
const authenticate = (req, res, next) => {
  // Extract token from Authorization header (Bearer Token)
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Access Denied. No Token found! Please Login." });
  }

  try {
    // Verify the token using the secret key
    const verified = jwt.verify(token, process.env.PROD_JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = verified;

    // console.log("Decoded User: ", req.user);

    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(400).json({ msg: "Invalid Token" });
  }
};

module.exports = authenticate;
