const Router = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/UsersModel");
const Employers = require("../models/EmployersModel");
const sessionRoutes = require("./sessionRoutes");
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

require("dotenv").config({ path: ".env.server" });

const jwtSecret = process.env.DEV_JWT_SECRET;
if (!jwtSecret) {
  console.error("Error: DEV_JWT_SECRET is missing in the enviroment variables");
  process.exit(1);
}

const validRoles = ["jobSeeker", "employer"];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "15m",
  });
};

// Route for registering the New Employer
/**
 * @route POST /users-emp-register
 * @description Registers a new employer
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing employer details
 * @param {string} req.body.companyName - Name of the company (required)
 * @param {string} req.body.email - Employer's email address (required)
 * @param {string} [req.body.companyWebsite] - Employer's company website (optional)
 * @param {string} req.body.password - Employer's password (must meet complexity requirements)
 * @param {string} req.body.role - Role of the user (must be 'employer')
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 */
router.post("/users-emp-register", async (req, res) => {
  const { companyName, email, companyWebsite, password, role } = req.body;

  // Check if all the required fields are provided
  if (!companyName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required",
    });
  }

  // Optional company website validation (checks if it's a valid URL format)
  if (companyWebsite) {
    const websiteRegex =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    if (!websiteRegex.test(companyWebsite)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid company website URL format.",
      });
    }
  }

  // Validate the role to check if it is valid
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalid role specified" });
  }

  // Email validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid email format.",
    });
  }

  // Password validation using regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
      success: false,
    });
  }

  try {
    // Check if an account with this email already exists under the jobSeeker role
    const existingJobSeeker = await Users.findOne({ email, role: "jobSeeker" });
    if (existingJobSeeker) {
      return res.status(409).json({
        success: false,
        msg: "This email is already associated with a job seeker account",
      });
    }

    // Check if employer is already register with this email or companyName
    const existingEmployer = await Employers.findOne({
      $or: [{ email }, { companyName }],
    });

    if (existingEmployer) {
      return res.status(409).json({
        success: false,
        msg: "Company name or email already registered, login to continue.",
      });
    }

    // Hashing the password before storing it to the database
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newEmployer = await Employers.create({
      companyName,
      email,
      companyWebsite,
      password: hashedPassword,
      role,
    });

    const accessToken = generateAccessToken(newEmployer);
    await newEmployer.save();
    res.status(201).json({
      success: true,
      msg: "Employer registered successfully",
      token: { accessToken },
      newEmployer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while registering the new employer",
      error: error.message,
    });
  }
});

// Route for registering the New Users
/**
 * @route POST /users-seeker-register
 * @description Registers a new job seeker
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user details
 * @param {string} req.body.username - The username of the job seeker (required)
 * @param {string} req.body.email - The email address of the job seeker (required)
 * @param {string} req.body.phoneNumber - The phone number of the job seeker (must be 10 digits with optional +1)
 * @param {string} req.body.password - The password (must meet complexity requirements)
 * @param {string} req.body.role - The role of the user (must be 'jobSeeker')
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and message
 */
router.post("/users-seeker-register", async (req, res) => {
  const { username, email, phoneNumber, password, role } = req.body;

  // Check if all the required fields are provided
  if (!username || !email || !phoneNumber || !password || !role) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  // Validate the role to ensure it is valid
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalid role specified" });
  }

  // Email validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid email format",
    });
  }

  // Password validation using regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      msg: "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }

  // Phone number validation using regex
  const phoneNumberRegex = /^(?:\+1)?\d{10}$/; // Allow optional +1 prefix for US phone numbers
  if (!phoneNumberRegex.test(phoneNumber)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid phone number. It must be 10 digits (with optional +1).",
    });
  }

  // const numericPhoneNumber = Number(phoneNumber);
  // if (!numericPhoneNumber || numericPhoneNumber.toString().length !== 10) {
  //   return res.status(400).json({
  //     message: "Invalid US phone number. It must be 10 digits (with optional +1).",
  //     success: false,
  //   });
  // }

  try {
    const existingUser = await Users.findOne({ email, phoneNumber });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          msg: "Email already registered",
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({
          success: false,
          msg: "Phone Number is already registered",
        });
      }
    }

    // Hashing the password before storing in the database
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUsers = await Users.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    const accessToken = generateAccessToken(newUsers);
    await newUsers.save();
    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      tokens: { accessToken },
      newUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while registering the new user",
      error: error.message,
    });
  }
});

// Route for the Users to login
/**
 * @route POST /users-login
 * @description Authenticates a user and returns an access token upon successful login.
 * @access Public
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.email - The email address of the user (must be in valid format).
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response
 *
 * @throws {400} Bad Request - If email or password is missing, or email format is invalid.
 * @throws {404} Not Found - If the user with the provided email does not exist.
 * @throws {401} Unauthorized - If the password is incorrect.
 * @throws {500} Internal Server Error - If an error occurs during login processing.
 */

router.post("/users-login", sessionRoutes, async (req, res) => {
  const { email, password } = req.body;

  // Check if all the required fields are provided
  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Email validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid email format. Please enter a valid email address.",
    });
  }

  try {
    // Check if user exists with this email or not
    const users = await Users.findOne({ email });
    if (!users) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist" });
    }

    // Comparing the input password with hashed password from the database
    const isPasswordMatch = await bcrypt.compare(password, users.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const accessToken = generateAccessToken(users);

    req.session.isLoggedIn = true;
    const lastLogin = Date.now(); // Store the last login time
    users.lastLogin = lastLogin;
    req.session.user = users.username; // Assigning the correct username to the session
    req.session.userId = users._id;
    req.session.role = users.role;
    req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour
    await users.save();
    
    res.status(200).json({
      success: true,
      msg: "Login successfull",
      tokens: { accessToken },
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while login",
      error: error.message,
    });
  }
});

module.exports = router;
