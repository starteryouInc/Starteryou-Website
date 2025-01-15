require('dotenv').config({ path: '.env.server' }); 
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const validator = require("validator");
const router = express.Router();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const Employee = require("../models/EmployeeModel");
const cacheMiddleware = require("../cache/utils/cacheMiddleware");
const invalidateCache = require("../cache/utils/invalidateCache");

//dev_jwt_secret key
const jwtSecret = process.env.DEV_JWT_SECRET;
if (!jwtSecret) {
  console.error("Error: DEV_JWT_SECRET is missing in the environment variables.");
  process.exit(1); // Stop the app if DEV_JWT_SECRET is not defined
}

const validRoles = ["admin", "user"]; // Add more roles as needed

// Helper functions to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, jwtSecret, {
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
        url: `${BACKEND_URL}/api/v1/auth`, // Replace with your base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Specify the file where your API routes are defined
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Use Swagger UI
router.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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
 *                 example: "admin"  # Example: "admin" or "user"
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
    const { username, email, phoneNumber, password, role } = req.body;
    if (!username || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    
     // Validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@starteryou\.com$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email must be a valid starteryou.com email address",
      success: false,
    });
  }

    const validEmployee = await Employee.findOne({ email });
    console.log("Valid Employee:", validEmployee); // Log the valid employee for debugging
    if (!validEmployee) {
      return res.status(400).json({ message: "This email is not associated with a valid employee", success: false });
    }

    // Validate role
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
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

    // Check if email or phone number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          message: "Email already registered",
          success: false,
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({
          message: "Phone number already registered",
          success: false,
        });
      }
    }

    // Hash the password before saving
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
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
        role: user.role,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate entry. This email or phone number is already registered.",
        success: false,
      });
    } 

    // General error handler for other issues
    handleError(res, error);
  }
  await invalidateCache(req.originalUrl);
};


/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
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
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  // Validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@starteryou\.com$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email must be a valid starteryou.com email address",
      success: false,
    });
  }

  const validEmployee = await Employee.findOne({ email });
    console.log("Valid Employee:", validEmployee); // Log the valid employee for debugging
    if (!validEmployee) {
      return res.status(400).json({ message: "This email is not associated with a valid employee", success: false });
    }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      success: true,
      tokens: { accessToken, refreshToken },
      user: { id: user._id, username: user.username, email: user.email ,role: user.role},
    });
  } catch (error) {
    handleError(res, error);
  }
  await invalidateCache(req.originalUrl);
};
 

// Set up router

router.post("/register",cacheMiddleware, register);
router.post("/login",cacheMiddleware, login);
module.exports = router;
