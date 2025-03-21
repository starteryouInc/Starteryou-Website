const cacheConfig = require("../cache/config/cacheConfig");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const CompanyProfile = require("../models/CompanyProfile");
const logger = require("../utils/logger"); // Logger import

/**
 * @desc    Create a new company profile
 * @route   POST /api/v1/jobportal/company-profile
 * @access  Private (Employers Only)
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Request body containing company details
 * @param   {string} req.body.employerRegistrationId - Employer's registration ID (Required)
 * @param   {string} req.body.companyName - Name of the company (Required)
 * @param   {string} [req.body.companyWebsite] - Company website URL (Optional)
 * @param   {string} [req.body.industry] - Industry sector of the company (Optional)
 * @param   {string} [req.body.companySize] - Company size (e.g., "50-200 employees") (Optional)
 * @param   {string} [req.body.companyType] - Type of company (e.g., "Startup", "MNC") (Optional)
 * @param   {string} [req.body.location] - Company location (Optional)
 * @param   {string} [req.body.foundedDate] - Year or date when the company was founded (Optional)
 * @param   {string} [req.body.tagline] - Company tagline (Optional)
 * @param   {string} [req.body.about] - Short description about the company (Optional)
 * @param   {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
const createCompanyProfileHandler = async (req, res) => {
  const {
    employerRegistrationId,
    companyName,
    companyWebsite,
    industry,
    companySize,
    companyType,
    location,
    foundedDate,
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
      location,
      foundedDate,
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
};

/**
 * @desc    Fetch company profile based on employer ID
 * @route   GET /api/v1/jobportal/company-profile/:userId
 * @access  Private (Employers Only)
 * @param   {Object} req - Express request object
 * @param   {Object} req.params - Request parameters
 * @param   {string} req.params.userId - Employer's registration ID
 * @param   {Object} res - Express response object
 * @returns {Object} JSON response with company profile data or an error message
 */
const fetchCompanyProfileHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    // Define cache key
    const cacheKey = `/api/get-company-profile/${userId}`;
    logger.info(`Cache Key: ${cacheKey}`);

    // Fetch from cache or database
    const cachedCompanyProfile = await cacheQueryJob(
      cacheKey,
      async () => {
        const companyProfile = await CompanyProfile.findOne({
          employerRegistrationId: userId,
        });

        if (!companyProfile) {
          throw new Error("Company profile not found!"); // Prevent caching empty results
        }

        return companyProfile;
      },
      cacheConfig.defaultTTL
    );

    if (!cachedCompanyProfile) {
      return res.status(404).json({
        success: false,
        msg: "Company profile not found!",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Company profile found successfully",
      data: cachedCompanyProfile,
    });
  } catch (error) {
    // logger.error("Fetch Company Profile Error:", error);
    res.status(500).json({
      success: false,
      msg: "Some error occurred while fetching the company profile",
      error: error.message,
    });
  }
};

module.exports = { createCompanyProfileHandler, fetchCompanyProfileHandler };
