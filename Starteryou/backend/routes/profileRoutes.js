const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profilecontrollers");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getmyprofile", authenticateToken, getProfile);
router.put("/updatemyprofile", authenticateToken, updateProfile);

module.exports = router;
