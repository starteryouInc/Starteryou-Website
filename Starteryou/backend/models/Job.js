const mongoose = require("mongoose");

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

module.exports = mongoose.model("Job", JobSchema);
