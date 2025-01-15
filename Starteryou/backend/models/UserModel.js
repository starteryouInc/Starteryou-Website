const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "jobSeeker", "employer"],
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

// Method to handle login attempts
UserSchema.methods.incrementLoginAttempts = async function () {
  this.security.loginAttempts += 1;
  if (this.security.loginAttempts >= 5) {
    this.accountStatus.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock account for 15 minutes
  }
  await this.save();
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function () {
  this.security.loginAttempts = 0;
  this.accountStatus.lockedUntil = null;
  await this.save();
};

// Method to check account lock status
UserSchema.methods.isAccountLocked = function () {
  if (
    this.accountStatus.lockedUntil &&
    this.accountStatus.lockedUntil > new Date()
  ) {
    return true;
  }
  return false;
};

module.exports = mongoose.model("User", UserSchema);
