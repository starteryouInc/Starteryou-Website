const mongoose = require("mongoose"); // Import mongoose
const Joi = require("joi"); // Import Joi for validation
const mongoosePaginate = require("mongoose-paginate-v2"); // Pagination plugin

// Define the File Metadata Schema
const fileMetadataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: String,
      required: true,
      trim: true,
    },
    gridFsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Add Indexes
fileMetadataSchema.index({ title: 1, uploadedBy: 1 }, { unique: true });
fileMetadataSchema.index({ createdAt: -1 });
fileMetadataSchema.index({ gridFsFileId: 1 });

// Add Virtual Field
fileMetadataSchema.virtual("fileUrl").get(function () {
  return `/files/${this.gridFsFileId}`;
});

// Add Static Methods
fileMetadataSchema.statics.findByUploader = function (uploader) {
  return this.find({ uploadedBy: uploader });
};

// Add Instance Methods
fileMetadataSchema.methods.isRecent = function () {
  return Date.now() - this.createdAt < 7 * 24 * 60 * 60 * 1000; // Recent if less than 7 days old
};

// Middleware for Logging
fileMetadataSchema.pre("save", function (next) {
  console.log(`File metadata for "${this.title}" is being saved.`);
  next();
});

// Middleware for Error Handling
fileMetadataSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(new Error("Invalid data provided."));
  } else {
    next(error);
  }
});

// Add Pagination Plugin
fileMetadataSchema.plugin(mongoosePaginate);

// Export the Model with Cache Handling
let FileMetadata;
try {
  FileMetadata = mongoose.model("FileMetadata");
} catch (e) {
  FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);
}
module.exports = FileMetadata;

// Validation Function using Joi
module.exports.validateFileMetadata = function (file) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    originalFilename: Joi.string().required(),
    uploadedBy: Joi.string().required(),
    gridFsFileId: Joi.string().required(),
  });

  return schema.validate(file);
};
