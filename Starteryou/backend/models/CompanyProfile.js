const mongoose = require("mongoose");

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
  tagline: {
    type: String,
  },
  about: {
    type: String,
  },
});

module.exports = mongoose.model("CompanyProfile", CompanyProfileSchema);
