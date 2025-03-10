const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    image: {
      type: String, // Store the Base64 string of the image
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    team: {
      type: String, // Add the 'team' field
      required: true, // Ensure it's always provided
    },
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
