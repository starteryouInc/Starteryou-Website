const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/UserModel");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const validator = require("validator");
const router = express.Router();

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is missing in the environment variables.");
  process.exit(1); // Stop the app if JWT_SECRET is not defined
}

// Helper functions to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
/**
 * Centralized error handler
 */
const handleError = (res, error, statusCode = 500) => {
  console.error("Error:", error);
  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    success: false,
  });
};

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description:
        "API for managing Authentication endpoints for user registration, login, and token refresh",
    },
    servers: [
      {
        url: "${BACKEND_URL}/api/v1/auth", // Replace with your base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Specify the file where your API routes are defined
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Use Swagger UI
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "user"  # Example: "admin" or "user"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
const register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role} = req.body;

    if (!username || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    // email validation
    if (
      !validator.isEmail(email) ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
        success: false,
      });
    }

    // Validate phone number
    const numericPhoneNumber = Number(phoneNumber);
    if (!numericPhoneNumber || numericPhoneNumber.toString().length !== 10) {
      return res.status(400).json({
        message: "Phone number must be 10 digits and numeric",
        success: false,
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "Email already registered",
          success: false,
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({
          message: "Phone number already registered",
          success: false,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      tokens: { accessToken, refreshToken },
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password ) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      success: true,
      tokens: { accessToken, refreshToken },
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @swagger
 * /v1/auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
 */
const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user) {
      user.refreshToken = null; // Invalidate the refresh token
      await user.save();
    }

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @swagger
 * /v1/auth/refreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your-refresh-token-here"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: "new-access-token-here"
 *       400:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal Server Error
 */
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ message: "Refresh token is required", success: false });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token", success: false });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    handleError(res, error);
  }
};
// Set up router

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/refreshToken", refreshToken);

module.exports = router;
