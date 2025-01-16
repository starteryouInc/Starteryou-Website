const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const TeamMember = require("../models/TeamMember");
require("dotenv").config();
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary directory for image files

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Team Member API",
      version: "1.0.0",
      description: "API for managing team members",
    },
    servers: [
      {
        url: `${backendUrl}/api/team`, // Update with your server URL
      },
    ],
  },
  apis: [__filename], // Use this file for documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI route
router.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Helper function to convert image to Base64 string
const convertImageToBase64 = (imagePath) => {
  const file = fs.readFileSync(imagePath);
  return `data:image/jpeg;base64,${file.toString("base64")}`; // Change 'jpeg' to match the file type if needed
};

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Add a new team member
 *     tags: [Team Member]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               about:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Team member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       500:
 *         description: Server error
 */
router.post("/team", upload.single("image"), async (req, res) => {
  const { name, position, about, linkedin } = req.body;

  const imageBase64 = req.file ? convertImageToBase64(req.file.path) : null;

  try {
    const teamMember = new TeamMember({
      name,
      position,
      about,
      linkedin,
      image: imageBase64,
    });

    await teamMember.save();
    res.status(200).json(teamMember);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving team member", error: error.message });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Fetch all team members
 *     tags: [Team Member]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMember'
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get("/team", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const teamMembers = await TeamMember.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await TeamMember.countDocuments();

    res.status(200).json({ data: teamMembers, total });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching team members", error: error.message });
  }
});

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Delete a team member by ID
 *     tags: [Team Member]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Team member ID
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.delete("/team/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting team member", error: error.message });
  }
});

module.exports = router;
