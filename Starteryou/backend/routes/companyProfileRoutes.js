const Router = require("express");
const router = Router();
const CompanyProfile = require("../models/CompanyProfile");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/create-company-profile",
  authorize("employer"),
  async (req, res) => {
    const {
      employerRegistrationId,
      companyName,
      companyWebsite,
      industry,
      companySize,
      companyType,
      tagline,
      about,
    } = req.body;

    if (!employerRegistrationId || !companyName) {
      return res.status(400).json({
        success: false,
        msg: "Required fields (employerRegistrationId, companyName) are missing",
      });
    }
    try {
      const newCompany = new CompanyProfile({
        employerRegistrationId,
        companyName,
        companyWebsite,
        industry,
        companySize,
        companyType,
        tagline,
        about,
      });
      const response = await newCompany.save();
      res.status(201).json({
        success: true,
        msg: "Company profile has been created successfully nothing changes",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while creating the company profile",
        error: error.message,
      });
    }
  }
);

router.get(
  "/get-company-profile/:userId",
  authorize("employer"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    try {
      const fetchCompanyProfile = await CompanyProfile.findOne({
        employerRegistrationId: userId,
      });
      if (!fetchCompanyProfile) {
        return res.status(404).json({
          success: false,
          msg: "Company profile not found!",
        });
      }
      res.status(200).json({
        success: true,
        msg: "Company profile found successfully",
        data: fetchCompanyProfile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching the company profile",
        error: error.message,
      });
    }
  }
);

module.exports = router;
