const mongoose = require("mongoose");

/**
 * Mongoose schema for storing job applications.
 * 
 * @typedef {Object} Application
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user applying for the job.
 * @property {mongoose.Schema.Types.ObjectId} jobId - The ID of the job being applied for.
 * @property {string} firstName - The first name of the applicant.
 * @property {string} lastName - The last name of the applicant.
 * @property {string} email - The email address of the applicant.
 * @property {string} status - The application status (applied, shortlisted, rejected).
 * @property {string} [whyHire] - A brief reason why the applicant should be hired.
 * @property {Date} appliedAt - The timestamp when the application was submitted.
 */
const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied",
  },
  whyHire: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose model for the Application schema.
 * 
 * @module Application
 * @type {mongoose.Model<Application>}
 */
module.exports = mongoose.model("Application", applicationSchema);

