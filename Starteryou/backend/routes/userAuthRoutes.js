const Router = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/UsersModel");
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

// Route for registering the New Users
router.post("/users-register", async (req, res) => {
  const { username, email, phoneNumber, password, role } = req.body;

  if (!username || !email || !phoneNumber || !password || !role) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }
  if (!validRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalid role specified" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
      success: false,
    });
  }

  const numericPhoneNumber = Number(phoneNumber);
  if (!numericPhoneNumber || numericPhoneNumber.toString().length !== 10) {
    return res.status(400).json({
      message: "Phone number must be 10 digits and numeric",
      success: false,
    });
  }

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
      error,
    });
  }
});

// Route for the Users to login
router.post("/users-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    const users = await Users.findOne({ email });
    if (!users) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, users.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const accessToken = generateAccessToken(users);
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
      error,
    });
  }
});

module.exports = router