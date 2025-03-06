const mongoose = require("mongoose");

/**
 * Mongoose schema for storing user authentication details.
 *
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user (must be unique).
 * @property {number} phoneNumber - The user's phone number.
 * @property {string} password - The hashed password of the user.
 * @property {"jobSeeker" | "employer"} role - The role of the user.
 * @property {Object} accountStatus - The account status details.
 * @property {boolean} accountStatus.active - Indicates if the account is active.
 * @property {boolean} accountStatus.verified - Indicates if the account is verified.
 * @property {Date | null} accountStatus.lockedUntil - Date until which the account is locked (null if not locked).
 * @property {Object} security - Security settings for the user.
 * @property {Date} [security.lastLogin] - Timestamp of the last login.
 * @property {number} [security.loginAttempts] - Number of failed login attempts.
 * @property {boolean} security.mfaEnabled - Indicates if multi-factor authentication is enabled.
 * @property {("totp" | "sms")[]} [security.mfaMethod] - MFA methods enabled for the user.
 * @property {Object} tokens - Authentication tokens.
 * @property {string} [tokens.accessToken] - The access token for authentication.
 * @property {string} [tokens.refreshToken] - The refresh token for authentication.
 * @property {Date} createdAt - Timestamp of account creation.
 * @property {Date} updatedAt - Timestamp of last profile update.
 */
const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      // unique: true, // Consider enabling unique constraint if necessary
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
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

/**
 * Mongoose model for the Users schema.
 * 
 * @module User
 * @type {mongoose.Model<User>}
 */
module.exports = mongoose.model("Users-Auth", UsersSchema);

