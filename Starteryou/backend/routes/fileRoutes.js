const express = require("express");
const multer = require("multer");
const {GridFSBucket} = require("mongodb");
const mongoose = require("mongoose");
const FileMetadata = require("../models/FileMetadata");

const router = express.Router();
const mongoURI = process.env.MONGODB_URI;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "your_database_name", // Specify your database name
});

let bucket;
conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, {bucketName: "uploads"});
  console.log("GridFS bucket connection established");
});

conn.on("error", (error) => {
  console.error("GridFS connection error:", error);
});

const storage = multer.memoryStorage();
const upload = multer({storage});

// Middleware to check if bucket is initialized
const checkBucket = (req, res, next) => {
  if (!bucket) {
    return res.status(500).json({message: "File storage is not initialized"});
  }
  next();
};

// Route for uploading an image with metadata
router.post("/upload", upload.single("file"), checkBucket, async (req, res) => {
  const {buffer, originalname} = req.file;
  const {title, uploadedBy} = req.body;

  if (!uploadedBy) {
    return res
      .status(400)
      .json({message: 'The "uploadedBy" field is required'});
  }

  const uploadStream = bucket.openUploadStream(originalname);
  uploadStream.end(buffer);

  uploadStream.on("finish", async (file) => {
    try {
      const fileMetadata = new FileMetadata({
        title,
        originalFilename: originalname,
        uploadedBy,
        gridFsFileId: file._id,
      });

      await fileMetadata.save();
      res
        .status(201)
        .json({file: {_id: file._id, filename: originalname, title}});
    } catch (error) {
      console.error("Error saving metadata:", error);
      res.status(500).json({message: "Error saving file metadata"});
    }
  });

  uploadStream.on("error", (error) => {
    console.error("Error during upload:", error);
    res.status(500).json({message: error.message});
  });
});

// Route for updating an existing image by title
router.put("/update", upload.single("file"), checkBucket, async (req, res) => {
  const {buffer, originalname} = req.file;
  const {title} = req.body;

  try {
    const existingFileMetadata = await FileMetadata.findOne({title});
    if (!existingFileMetadata) {
      return res.status(404).json({message: "File not found"});
    }

    const oldFileId = existingFileMetadata.gridFsFileId;

    const uploadStream = bucket.openUploadStream(originalname);
    uploadStream.end(buffer);

    uploadStream.on("finish", async (file) => {
      try {
        existingFileMetadata.gridFsFileId = file._id;
        await existingFileMetadata.save();

        if (oldFileId) {
          await bucket.delete(oldFileId).catch((err) => {
            console.error("Error deleting old file:", err);
            // Continue execution even if old file deletion fails
          });
        }

        res
          .status(200)
          .json({file: {_id: file._id, filename: originalname, title}});
      } catch (error) {
        console.error("Error updating metadata:", error);
        res.status(500).json({message: "Error updating file metadata"});
      }
    });

    uploadStream.on("error", (error) => {
      console.error("Error during upload:", error);
      res.status(500).json({message: error.message});
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({message: error.message});
  }
});

// Route to fetch all uploaded files metadata
router.get("/", async (req, res) => {
  try {
    const files = await FileMetadata.find().select(
      "title originalFilename uploadedBy createdAt"
    );
    res.status(200).json({files});
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({message: "Error fetching files"});
  }
});

// Route to get a file by title
router.get("/title/:title", checkBucket, async (req, res) => {
  const {title} = req.params;

  try {
    const metadata = await FileMetadata.findOne({title});
    if (!metadata) {
      return res.status(404).json({message: "File not found"});
    }

    const readStream = bucket.openDownloadStream(metadata.gridFsFileId);
    readStream.pipe(res);

    readStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      res.status(500).json({message: "Error streaming file"});
    });
  } catch (error) {
    console.error("Error fetching file by title:", error);
    res.status(500).json({message: "Error fetching file"});
  }
});

module.exports = router;
