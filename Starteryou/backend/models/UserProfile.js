const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    professionalTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    currentCompany: {
      type: String,
    },
    totalExperience: {
      type: String,
    },
    phoneNo: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    workExperience: [
      {
        companyName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    educationDetails: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        startYear: { type: Number, required: true },
        endYear: { type: Number },
        Marks: { type: Number },
        description: { type: String },
      },
    ],
    skills: {
      type: [String],
    },
    certifications: [
      {
        title: { type: String, required: true },
        issuedBy: { type: String, required: true },
        issueDate: { type: Date },
        certificateURL: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        endYear: { type: Number },
        technologiesUsed: { type: [String] },
        projectURL: { type: String },
      },
    ],
    languages: {
      type: [String],
    },
    availabilityStatus: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
