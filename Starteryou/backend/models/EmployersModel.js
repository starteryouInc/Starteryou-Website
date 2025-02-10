const mongoose = require("mongoose");

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

module.exports = mongoose.model("Users-auth", EmployersSchema);
