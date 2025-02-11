const mongoose = require("mongoose");

/**
 * Mongoose schema for storing user profiles.
 *
 * @typedef {Object} UserProfile
 * @property {mongoose.Schema.Types.ObjectId} userRegistrationId - The ID of the registered user.
 * @property {string} name - The full name of the user.
 * @property {string} [professionalTitle] - The user's professional title.
 * @property {string} [location] - The user's current location.
 * @property {string} [currentCompany] - The company where the user is currently employed.
 * @property {string} [totalExperience] - The total work experience of the user.
 * @property {number} [phoneNo] - The user's phone number.
 * @property {string} email - The user's email address.
 * @property {Array.<Object>} workExperience - List of work experiences.
 * @property {string} workExperience.companyName - Name of the company.
 * @property {string} workExperience.jobTitle - Job title at the company.
 * @property {Date} workExperience.startDate - Start date of employment.
 * @property {Date} [workExperience.endDate] - End date of employment.
 * @property {string} [workExperience.description] - Description of the job role.
 * @property {Array.<Object>} educationDetails - List of educational qualifications.
 * @property {string} educationDetails.institution - Name of the institution.
 * @property {string} educationDetails.degree - Degree obtained.
 * @property {string} [educationDetails.specialization] - Specialization field.
 * @property {Date} educationDetails.startYear - Year of enrollment.
 * @property {Date} [educationDetails.endYear] - Year of graduation.
 * @property {number} [educationDetails.Marks] - Marks obtained.
 * @property {string} [educationDetails.description] - Additional details about education.
 * @property {string[]} [skills] - List of skills possessed by the user.
 * @property {Array.<Object>} certifications - List of certifications.
 * @property {string} certifications.title - Title of the certification.
 * @property {string} certifications.issuedBy - Issuing authority.
 * @property {Date} [certifications.expiryDate] - Expiry date of certification.
 * @property {string} [certifications.certificateURL] - URL to the certificate.
 * @property {Array.<Object>} projects - List of projects.
 * @property {string} projects.title - Title of the project.
 * @property {string} [projects.description] - Project description.
 * @property {Date} [projects.endYear] - Year the project was completed.
 * @property {string[]} [projects.technologiesUsed] - Technologies used in the project.
 * @property {string} [projects.projectURL] - URL to the project.
 * @property {string[]} [languages] - Languages known by the user.
 * @property {boolean} [availabilityStatus] - Availability for job opportunities.
 * @property {Object} [socialLinks] - Social media links.
 * @property {string} [socialLinks.linkedin] - LinkedIn profile URL.
 * @property {string} [socialLinks.github] - GitHub profile URL.
 * @property {string} [socialLinks.instagram] - Instagram profile URL.
 * @property {string} [socialLinks.twitter] - Twitter profile URL.
 * @property {Date} createdAt - Timestamp of profile creation.
 * @property {Date} updatedAt - Timestamp of last profile update.
 */
const UserProfileSchema = new mongoose.Schema(
  {
    userRegistrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    professionalTitle: {
      type: String,
    },
    location: {
      type: String,
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
        specialization: { type: String },
        startYear: { type: Date, required: true },
        endYear: { type: Date },
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
        expiryDate: { type: Date },
        certificateURL: { type: String },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        endYear: { type: Date },
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

/**
 * Mongoose model for the UserProfile schema.
 * 
 * @module UserProfile
 * @type {mongoose.Model<UserProfile>}
 */
module.exports = mongoose.model("UserProfile", UserProfileSchema);

