const mongoose = require("mongoose");

/**
 * Mongoose schema for storing employer user accounts.
 * 
 * @typedef {Object} Employer
 * @property {string} companyName - The name of the employer's company.
 * @property {string} email - The email address of the employer (must be unique).
 * @property {string} [companyWebsite] - The website URL of the company.
 * @property {string} password - The hashed password for authentication.
 * @property {string} role - The role of the user (only "employer" allowed).
 * @property {Object} accountStatus - The status of the employer's account.
 * @property {boolean} accountStatus.active - Whether the account is active.
 * @property {boolean} accountStatus.verified - Whether the account is verified.
 * @property {Date|null} accountStatus.lockedUntil - The timestamp until which the account is locked.
 * @property {Object} [security] - Security-related details of the employer account.
 * @property {Date} [security.lastLogin] - The timestamp of the last login.
 * @property {number} [security.loginAttempts] - The number of unsuccessful login attempts.
 * @property {boolean} [security.mfaEnabled] - Whether multi-factor authentication (MFA) is enabled.
 * @property {string[]} [security.mfaMethod] - The MFA methods enabled ("totp" or "sms").
 * @property {Object} [tokens] - Authentication tokens for the employer.
 * @property {string} [tokens.accessToken] - The access token for authentication.
 * @property {string} [tokens.refreshToken] - The refresh token for authentication.
 * @property {Date} createdAt - Timestamp when the employer account was created.
 * @property {Date} updatedAt - Timestamp when the employer account was last updated.
 */
const EmployersSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      // unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyWebsite: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employer"],
      required: true,
    },
    accountStatus: {
      active: {
        type: Boolean,
        default: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      lockedUntil: {
        type: Date,
        default: null,
      },
    },
    security: {
      lastLogin: {
        type: Date,
      },
      loginAttempts: {
        type: Number,
      },
      mfaEnabled: {
        type: Boolean,
        default: false,
      },
      mfaMethod: {
        type: [String],
        enum: ["totp", "sms"],
      },
    },
    tokens: {
      accessToken: { type: String },
      refreshToken: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for the Employer schema.
 * 
 * @module Users-auth
 * @type {mongoose.Model<Employer>}
 */
module.exports = mongoose.model("Users-auth", EmployersSchema);

