const mongoose = require("mongoose");

/**
 * Mongoose schema for storing company profiles.
 * 
 * @typedef {Object} CompanyProfile
 * @property {mongoose.Schema.Types.ObjectId} employerRegistrationId - The ID of the employer who owns the company profile.
 * @property {string} companyName - The name of the company.
 * @property {string} [companyWebsite] - The website URL of the company.
 * @property {string} [industry] - The industry the company belongs to.
 * @property {string} [companySize] - The size of the company.
 * @property {string} [companyType] - The type of company (e.g., Private, Public, Startup).
 * @property {string} [tagline] - A short tagline or slogan of the company.
 * @property {string} [about] - A brief description or overview of the company.
 */
const CompanyProfileSchema = new mongoose.Schema({
  employerRegistrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
  },
  industry: {
    type: String,
  },
  companySize: {
    type: String,
  },
  companyType: {
    type: String,
  },
  location: {
    type: String,
  },
  foundedDate: {
    type: Date,
  },
  tagline: {
    type: String,
  },
  about: {
    type: String,
  },
});

/**
 * Mongoose model for the CompanyProfile schema.
 * 
 * @module CompanyProfile
 * @type {mongoose.Model<CompanyProfile>}
 */
module.exports = mongoose.model("CompanyProfile", CompanyProfileSchema);

