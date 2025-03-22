const mongoose = require("mongoose");

// Base schema for both users
const BaseUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobSeeker", "employer"],
      required: true,
    },
    tokens: {
      accessToken: { type: String },
      refreshToken: { type: String },
    },
  },
  {
    discriminatorKey: "role",
    timestamps: true,
  }
);

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);

// JobSeeker schema
const JobSeekerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

// Employer schema
const EmployerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
  },
});

// Create discriminator models
const JobSeeker = BaseUser.discriminator("jobSeeker", JobSeekerSchema);
const Employer = BaseUser.discriminator("employer", EmployerSchema);

module.exports = { BaseUser, JobSeeker, Employer };
