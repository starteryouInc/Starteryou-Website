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
      required: true,
    },
    image: {
      type: String, // Store the Base64 string of the image
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
