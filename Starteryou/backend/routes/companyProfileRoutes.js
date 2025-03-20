const Router = require("express");
const router = Router();
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");
const {
  createCompanyProfileHandler,
  fetchCompanyProfileHandler,
} = require("../handlers/CompanyProfileHandlers");

/**
 * @route POST /create-company-profile
 * @description Create a company profile for the authenticated employer
 * @access Private (employer)
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler createCompanyProfileHandler - Handles the company profile creation logic
 */
router.post(
  "/create-company-profile",
  authorize("employer"),
  createCompanyProfileHandler
);

/**
 * @route GET /get-company-profile/:userId
 * @description Retrieve the company profile associated with the given user ID
 * @access Private (employer)
 * @param {string} userId - The ID of the employer whose company profile is being fetched
 * @middleware authorize - Ensures that the user has the "employer" role
 * @middleware cacheMiddlewareJob - Handles caching for optimized performance
 * @handler fetchCompanyProfileHandler - Handles fetching the company profile
 */
router.get(
  "/get-company-profile/:userId",
  authorize("employer"),
  cacheMiddlewareJob,
  fetchCompanyProfileHandler
);

module.exports = router;
