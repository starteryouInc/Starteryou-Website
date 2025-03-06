const Router = require("express");
const router = Router();
const CompanyProfile = require("../models/CompanyProfile");
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");
// const { invalidateCache } = require("../cache/utils/invalidateCache");

/**
 * @route POST /create-company-profile
 * @description Creates a new company profile for an employer.
 * @access Private (Employer only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing company details
 * @param {string} req.body.employerRegistrationId - Unique employer registration ID (required)
 * @param {string} req.body.companyName - Name of the company (required)
 * @param {string} [req.body.companyWebsite] - Website of the company
 * @param {string} [req.body.industry] - Industry type
 * @param {string} [req.body.companySize] - Size of the company
 * @param {string} [req.body.companyType] - Type of the company
 * @param {string} [req.body.location] - Location of the company
 * @param {string} [req.body.foundedDate] - Year the company was founded
 * @param {string} [req.body.tagline] - Company tagline
 * @param {string} [req.body.about] - Description about the company
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and created company profile
 * @throws {Error} If required fields are missing or an internal server error occurs
 */
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
  }
);

/**
 * @route GET /get-company-profile/:userId
 * @description Fetches the company profile of an employer.
 * @access Private (Employer only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.userId - Employer's registration ID
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and company profile data
 * @throws {Error} If the company profile is not found or an internal server error occurs
 */
router.get(
  "/get-company-profile/:userId",
  authorize("employer"),
  cacheMiddlewareJob,
  async (req, res) => {
    const { userId } = req.params;

    try {
      // Define cache key
      const cacheKey = `/api/get-company-profile/${userId}`;
      console.log(`Cache Key: ${cacheKey}`);

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
      console.error("Fetch Company Profile Error:", error);
      res.status(500).json({
        success: false,
        msg: "Some error occurred while fetching the company profile",
        error: error.message,
      });
    }
  }
);

module.exports = router;
