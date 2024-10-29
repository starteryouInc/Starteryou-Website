const express = require("express");
const multer = require("multer");
const {GridFSBucket} = require("mongodb");
const mongoose = require("mongoose");
const FileMetadata = require("../models/FileMetadata"); // Import the FileMetadata model

const router = express.Router();
// Update this line to use the correct MongoDB URI
const mongoURI = "mongodb://54.196.202.145:27017/starteryou"; // Add database name 'starteryou'
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let bucket;
conn.once("open", () => {
  bucket = new GridFSBucket(conn.db, {bucketName: "uploads"}); // Use 'uploads' as the bucket name
});

const storage = multer.memoryStorage(); // Use memory storage for multer
const upload = multer({storage});

// Route for uploading an image with metadata
router.post("/upload", upload.single("file"), async (req, res) => {
  const {buffer, originalname} = req.file;
  const {title, uploadedBy} = req.body; // Get title and uploadedBy from request body

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

      await fileMetadata.save(); // Save metadata to the database
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

// Route for updating an existing image by title and deleting the old image after a successful update
router.put("/update", upload.single("file"), async (req, res) => {
  const {buffer, originalname} = req.file;
  const {title} = req.body; // Get title from the request body

  try {
    // Find the existing file metadata by title
    const existingFileMetadata = await FileMetadata.findOne({title});
    if (!existingFileMetadata) {
      console.error("File not found for title:", title);
      return res.status(404).json({message: "File not found"});
    }

    const oldFileId = existingFileMetadata.gridFsFileId; // Store old file ID for deletion later

    // Create a new upload stream for the new file
    const uploadStream = bucket.openUploadStream(originalname);
    uploadStream.end(buffer);

    // Handle the upload finish event
    uploadStream.on("finish", async (file) => {
      console.log(
        "New version of file uploaded. Old ID:",
        oldFileId,
        "New ID:",
        file._id
      );

      // Update the metadata with the new file ID
      existingFileMetadata.gridFsFileId = file._id;
      await existingFileMetadata.save(); // Save updated metadata

      // Delete the old file from GridFS
      if (oldFileId) {
        try {
          await bucket.delete(oldFileId);
          console.log("Old file deleted successfully:", oldFileId);
        } catch (deleteError) {
          console.error("Error deleting old file:", deleteError);
        }
      }

      res
        .status(200)
        .json({file: {_id: file._id, filename: originalname, title}});
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
      "title originalFilename uploadedBy createdAt:"
    );
    res.status(200).json({files});
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({message: error.message});
  }
});

// Route to get a file by title
router.get("/title/:title", async (req, res) => {
  const {title} = req.params;

  try {
    const metadata = await FileMetadata.findOne({title});
    if (!metadata) {
      return res.status(404).json({message: "File not found"});
    }

    const readStream = bucket.openDownloadStream(metadata.gridFsFileId);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching file by title:", error);
    res.status(500).json({message: error.message});
  }
});

module.exports = router;
