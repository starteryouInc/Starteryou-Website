const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const FileMetadata = require("../models/FileMetadata");
require("dotenv").config();
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const router = express.Router();
const cacheMiddleware = require("../cache/utils/cacheMiddleware");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQuery = require("../cache/utils/cacheQuery");
const cacheConfig = require("../cache/config/cacheConfig");

// Initialize GridFSBucket
let bucket;
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log("✅ GridFS bucket initialized");
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper function to ensure GridFSBucket is initialized
const ensureBucket = () => {
  if (!bucket) {
    throw new Error("GridFSBucket not initialized. MongoDB connection failed.");
  }
  return bucket;
};

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload API",
      version: "1.0.0",
      description:
        "API for file upload, download, update, and delete operations using GridFS",
    },
    servers: [
      {
        url: `${backendUrl}:3000/api/`,
      },
    ],
  },
  apis: ["./routes/fileRoutes.js"], // Path to this file
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Swagger UI setup
router.use("/api-test", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - FileRoutes
 *     summary: Upload a file with metadata
 *     description: Upload a file and its metadata (title, uploadedBy) to the server and store it in GridFS.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *               title:
 *                 type: string
 *                 description: The title of the file
 *               uploadedBy:
 *                 type: string
 *                 description: The user who uploaded the file (optional)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: example-file-title
 *                     originalFilename:
 *                       type: string
 *                       example: example-file.txt
 *                     uploadedBy:
 *                       type: string
 *                       example: john_doe
 *                     contentType:
 *                       type: string
 *                       example: text/plain
 *                     size:
 *                       type: integer
 *                       example: 1024
 *                     gridFsFileId:
 *                       type: string
 *                       example: 60c72b2f9e1d4f001f8e3b3a
 *       400:
 *         description: Bad request, missing required parameters or file title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: File title already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error uploading file
 *                 error:
 *                   type: string
 *                   example: Server connection failed
 */
router.post("/upload", upload.single("file"), cacheMiddleware, async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      if (!req.body.title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }

      const gridFsBucket = ensureBucket();

      // Check if a file with the same title already exists
      const existingFile = await FileMetadata.findOne({
        title: req.body.title,
      });
      if (existingFile) {
        return res
          .status(400)
          .json({ success: false, message: "File title already exists" });
      }

      // Upload the file to GridFS
      const uploadStream = gridFsBucket.openUploadStream(
        req.file.originalname,
        {
          contentType: req.file.mimetype,
          metadata: {
            title: req.body.title,
            uploadedBy: req.body.uploadedBy || "unknown",
          },
        }
      );

      // Finalize the upload
      uploadStream.end(req.file.buffer, async (err) => {
        if (err) throw err;

        // Save metadata to the database
        const fileMetadata = new FileMetadata({
          title: req.body.title,
          originalFilename: req.file.originalname,
          uploadedBy: req.body.uploadedBy || "unknown",
          contentType: req.file.mimetype,
          size: req.file.size,
          gridFsFileId: uploadStream.id,
        });

        await fileMetadata.save();

        // Cache the response for the uploaded file
        const cacheKey = `/api/download/${req.body.title}`;
        const responseToCache = {
          success: true,
          message: "File uploaded successfully",
          metadata: fileMetadata,
        };

        await cacheResponse(cacheKey, responseToCache);

        // Respond to the client
        res.status(201).json(responseToCache);
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /update/{title}:
 *   put:
 *     tags:
 *       - FileRoutes
 *     summary: Update a file by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The new file to replace the existing one
 *     responses:
 *       200:
 *         description: File updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File updated successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     gridFsFileId:
 *                       type: string
 *                       example: 60af884f4f1a25620d8f4d9a
 *                     originalFilename:
 *                       type: string
 *                       example: updated_file.pdf
 *                     contentType:
 *                       type: string
 *                       example: application/pdf
 *                     size:
 *                       type: integer
 *                       example: 102400
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: No file provided for update
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error updating file
 *                 error:
 *                   type: string
 */
router.put("/update/:title", upload.single("file"), cacheMiddleware, async (req, res) => {
    try {
      const gridFsBucket = ensureBucket();

      // Find the file metadata by title
      const fileMetadata = await FileMetadata.findOne({
        title: req.params.title,
      });
      if (!fileMetadata) {
        return res
          .status(404)
          .json({ success: false, message: "File not found" });
      }

      if (req.file) {
        // Delete the old file in GridFS
        await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));

        // Upload the new file to GridFS
        const uploadStream = gridFsBucket.openUploadStream(
          req.file.originalname,
          {
            contentType: req.file.mimetype,
          }
        );

        uploadStream.end(req.file.buffer, async (err) => {
          if (err) throw err;

          // Update file metadata
          fileMetadata.gridFsFileId = uploadStream.id;
          fileMetadata.originalFilename = req.file.originalname;
          fileMetadata.contentType = req.file.mimetype;
          fileMetadata.size = req.file.size;

          await fileMetadata.save();

          // Invalidate cache for the updated file
          const cacheKey = `/api/download/${req.params.title}`;
          await invalidateCache(cacheKey);

          res.json({
            success: true,
            message: "File updated successfully",
            metadata: fileMetadata,
          });
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "No file provided for update" });
      }
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating file",
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /download/{title}:
 *   get:
 *     tags:
 *       - FileRoutes
 *     summary: Download a file by title or ID
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title or ObjectId of the file to download
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get("/download/:title", cacheMiddleware, async (req, res) => {
  try {
    const gridFsBucket = ensureBucket();

    const cacheKey = `/api/download/${req.params.title}`;
    console.log(`Cache Key: ${cacheKey}`);

    // Validate if the parameter is a valid ObjectId
    const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

    // Check cache or fetch data
    const cachedResponse = await cacheQuery(
      cacheKey,
      async () => {
        const query = isValidObjectId(req.params.title)
          ? { _id: new ObjectId(req.params.title) } // Search by _id if valid ObjectId
          : { title: req.params.title }; // Otherwise, search by title

        const fileMetadata = await FileMetadata.findOne(query);

        if (!fileMetadata) {
          throw new Error("File not found"); // Trigger a cache miss if not found
        }

        return {
          contentType: fileMetadata.contentType,
          originalFilename: fileMetadata.originalFilename,
          gridFsFileId: fileMetadata.gridFsFileId,
        };
      },
      cacheConfig.defaultTTL
    );

    if (!cachedResponse) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.set({
      "Content-Type": cachedResponse.contentType,
      "Content-Disposition": `attachment; filename="${cachedResponse.originalFilename}"`,
    });

    const downloadStream = gridFsBucket.openDownloadStream(
      new ObjectId(cachedResponse.gridFsFileId)
    );

    downloadStream
      .pipe(res)
      .on("error", (err) => {
        console.error("Download error:", err);
        res
          .status(500)
          .json({ success: false, message: "Error downloading file" });
      })
      .on("finish", () => {
        console.log(
          `File successfully downloaded: ${cachedResponse.originalFilename}`
        );
      });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /delete/{title}:
 *   delete:
 *     tags:
 *       - FileRoutes
 *     summary: Delete a file
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:title", cacheMiddleware, async (req, res) => {
  try {
    const gridFsBucket = ensureBucket();

    const fileMetadata = await FileMetadata.findOne({
      title: req.params.title,
    });

    if (!fileMetadata) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Delete file from GridFS
    await gridFsBucket.delete(new ObjectId(fileMetadata.gridFsFileId));

    // Delete file metadata from the database
    await FileMetadata.deleteOne({ _id: fileMetadata._id });

    // Invalidate cache for the deleted file
    const cacheKey = `/api/download/${req.params.title}`;
    console.log(`Invalidating cache for key: ${cacheKey}`);
    await invalidateCache(cacheKey);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
});

module.exports = router;
