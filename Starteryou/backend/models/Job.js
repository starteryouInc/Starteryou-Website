const mongoose = require("mongoose");

/**
 * Mongoose schema for storing job postings.
 * 
 * @typedef {Object} Job
 * @property {string} title - The job title.
 * @property {string} description - The job description.
 * @property {string} location - The location of the job.
 * @property {string} industry - The industry to which the job belongs.
 * @property {string} jobType - The type of job (e.g., Full-time, Part-time, Internship, etc.).
 * @property {string} experienceLevel - The required experience level (Entry, Mid, Senior).
 * @property {string} workplaceType - The workplace type (On-site, Hybrid, Remote).
 * @property {Date} [startDate] - The start date of the job (if applicable).
 * @property {Date} [endDate] - The end date of the job (if applicable).
 * @property {Object} salaryRange - The salary range for the job.
 * @property {number} salaryRange.min - The minimum salary offered.
 * @property {number} salaryRange.max - The maximum salary offered.
 * @property {string} frequency - The payment frequency (Per Year, Per Month, Per Hour).
 * @property {string} companyName - The name of the company offering the job.
 * @property {mongoose.Schema.Types.ObjectId} postedBy - The ID of the user who posted the job.
 * @property {Date} createdAt - The timestamp when the job was posted.
 */
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: [
      "Full-time",
      "Part-time",
      "Contract",
      "Paid Internship",
      "Unpaid Internship",
      "Volunteer",
      "Job Shadow",
    ],
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ["Entry", "Mid", "Senior"],
    required: true,
  },
  workplaceType: {
    type: String,
    enum: ["On-site", "Hybrid", "Remote"],
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  frequency: {
    type: String,
    enum: ["Per Year", "Per Month", "Per Hour"],
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose model for the Job schema.
 * 
 * @module Job
 * @type {mongoose.Model<Job>}
 */
module.exports = mongoose.model("Job", JobSchema);

