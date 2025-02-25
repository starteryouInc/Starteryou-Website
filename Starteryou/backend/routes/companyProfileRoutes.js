const Router = require("express");
const router = Router();
const CompanyProfile = require("../models/CompanyProfile");
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");
// const { invalidateCache } = require("../cache/utils/invalidateCache");

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

// router.get(
//   "/get-company-profile/:userId",
//   authorize("employer"),
//   async (req, res) => {
//     const {
//       params: { userId },
//     } = req;
//     try {
//       const fetchCompanyProfile = await CompanyProfile.findOne({
//         employerRegistrationId: userId,
//       });
//       if (!fetchCompanyProfile) {
//         return res.status(404).json({
//           success: false,
//           msg: "Company profile not found!",
//         });
//       }
//       res.status(200).json({
//         success: true,
//         msg: "Company profile found successfully",
//         data: fetchCompanyProfile,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         msg: "Some error occured while fetching the company profile",
//         error: error.message,
//       });
//     }
//   }
// );

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
