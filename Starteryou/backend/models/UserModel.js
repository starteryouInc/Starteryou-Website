const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
      lowercase: true,
    },
    phoneNumber: {
      required: true,
      unique: true,
      type: Number,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      avatar: {
        type: String,
        default: "profile_image_url",
      },
    },
    roles: {
      type: [String],
      enum: ["user", "admin"],
    },
    permissions: {
      type: [String],
      enum: ["read:profile", "write:profile", "manage:users"],
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
    socialAuth: {
      googleId: { type: String, default: null },
      facebookId: { type: String, default: null },
      linkedInId: { type: String, default: null },
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
