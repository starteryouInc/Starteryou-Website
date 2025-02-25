const Router = require("express");
const router = Router();
const UserProfile = require("../models/UserProfile");
const {
  addSubdocument,
  updateSubdocument,
  deleteSubdocument,
  addStringToArray,
  deleteStringFromArray,
} = require("../services/userProfileService");
const authorize = require("../middleware/roleMiddleware");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");
// const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");

// Route to create the profile of the user
router.post("/create-profile", authorize("jobSeeker"), async (req, res) => {
  const { userRegistrationId, name, email, phoneNo } = req.body;
  if (!userRegistrationId || !name || !email) {
    return res.status(400).json({
      success: false,
      msg: "Required fields (userRegistrationId, name, email) are missing",
    });
  }
  try {
    // const newProfile = new UserProfile(req.body);
    const newProfile = new UserProfile({
      userRegistrationId,
      name,
      email,
      phoneNo,
    });
    const response = await newProfile.save();
    res.status(201).json({
      success: true,
      msg: "New Profile has been created successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while creating the new Profile",
      error,
    });
  }
});

router.get(
  "/fetch-profile/:userId",
  authorize("jobSeeker", "employer"),
  async (req, res) => {
    const { userId } = req.params;
    const cacheKey = `/fetch-profile/${userId}`;

    try {
      console.log(`Cache Key: ${cacheKey}`);

      // Check if cache exists
      let cachedProfile = await cacheQueryJob(cacheKey);

      // If cache exists but is invalid, fetch fresh data
      if (!cachedProfile || cachedProfile.needsRefresh) {
        console.log("Fetching fresh profile data from database...");
        cachedProfile = await UserProfile.find({
          userRegistrationId: userId,
        });

        if (!cachedProfile || cachedProfile.length === 0) {
          return res
            .status(404)
            .json({ success: false, msg: "No profile found!" });
        }

        // ✅ Store fresh data in cache
        await cacheQueryJob(
          cacheKey,
          () => cachedProfile,
          cacheConfig.defaultTTL
        );
      }

      res.status(200).json({
        success: true,
        dataLength: cachedProfile.length,
        msg: "Profiles fetched successfully",
        data: cachedProfile,
      });
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      res.status(500).json({
        success: false,
        msg: "Some error occurred while fetching the Profiles",
        error: error.message,
      });
    }
  }
);

router.patch(
  "/update-profile/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const { userRegistrationId } = req.params;
    const {
      professionalTitle,
      location,
      currentCompany,
      totalExperience,
      phoneNo,
    } = req.body;

    try {
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { userRegistrationId },
        {
          ...(professionalTitle && { professionalTitle }),
          ...(location && { location }),
          ...(currentCompany && { currentCompany }),
          ...(totalExperience && { totalExperience }),
          ...(phoneNo && { phoneNo }),
        },
        { new: true, lean: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          msg: "User Profile not found!",
        });
      }

      // ✅ Ensure Cache is Completely Removed
      const cacheKey = `/fetch-profile/${userRegistrationId}`;
      console.log(`Invalidating Cache: ${cacheKey}`);
      await invalidateCache(cacheKey); // Ensure this function removes the cache properly

      // ✅ Force a fresh fetch on the next request
      res.status(200).json({
        success: true,
        msg: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Profile Update Error:", error);
      res.status(500).json({
        success: false,
        msg: "Some error occurred while updating the profile",
        error: error.message,
      });
    }
  }
);

router.get(
  "/get-profile-fields/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    const { field } = req.query;

    try {
      if (!field) {
        return res.status(400).json({ msg: "Field parameter is required!" });
      }
      const validFields = [
        "workExperience",
        "educationDetails",
        "skills",
        "certifications",
        "projects",
        "languages",
      ];
      if (!validFields.includes(field)) {
        return res.status(400).json({ msg: "Invalid field requested!" });
      }

      const cacheKey = `/api/v1/jobportal/profile/get-profile-fields/${userRegistrationId}?field=${field}`;
      console.log(`Cache Key: ${cacheKey}`);

      // Fetch data with cache handling
      const cachedResponse = await cacheQueryJob(
        cacheKey,
        async () => {
          // Fetch only the requested field
          const user = await UserProfile.findOne(
            { userRegistrationId },
            { [field]: 1, _id: 0 } // Only return the requested field
          );
          if (!user) {
            return res.status(404).json({ msg: "User not found!" });
          }
          return user[field];
        },
        cacheConfig.defaultTTL
      );
      // Fetch only the requested field
      // const user = await UserProfile.findOne(
      //   { userRegistrationId },
      //   { [field]: 1, _id: 0 } // Only return the requested field
      // );
      // if (!user) {
      //   return res.status(404).json({ msg: "User not found!" });
      // }
      res.status(200).json({
        success: true,
        msg: `${field} fetched successfully`,
        data: cachedResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: `Some error occured while fetching the ${field}`,
        error,
      });
    }
  }
);

// Work Experience Routes
router.post(
  "/add-workExperience/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    await addSubdocument(userRegistrationId, "workExperience", req.body, res);
  }
);

router.put(
  "/update-workExperience/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const { userRegistrationId, subDocId } = req.params;
    await updateSubdocument(
      userRegistrationId,
      subDocId,
      "workExperience",
      req.body,
      res
    );
  }
);

router.delete(
  "/delete-workExperience/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await deleteSubdocument(
      userRegistrationId,
      subDocId,
      "workExperience",
      res
    );
  }
);

// Education Details Routes
router.post(
  "/add-educationDetails/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    try {
      const { userRegistrationId } = req.params;
      await addSubdocument(
        userRegistrationId,
        "educationDetails",
        req.body,
        res
      );
    } catch (error) {
      res.status(500).json({ success: false, msg: "Server error", error });
    }
  }
);

router.put(
  "/update-educationDetails/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await updateSubdocument(
      userRegistrationId,
      subDocId,
      "educationDetails",
      req.body,
      res
    );
  }
);

router.delete(
  "/delete-educationDetails/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await deleteSubdocument(
      userRegistrationId,
      subDocId,
      "educationDetails",
      res
    );
  }
);

// Skills Routes
router.post(
  "/add-skills/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    const { skill } = req.body;
    await addStringToArray(userRegistrationId, "skills", skill, res);
  }
);

router.delete(
  "/delete-skills/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    const { skill } = req.body;
    await deleteStringFromArray(userRegistrationId, "skills", skill, res);
  }
);

// Certificates Routes
router.post(
  "/add-certifications/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    await addSubdocument(userRegistrationId, "certifications", req.body, res);
  }
);

router.put(
  "/update-certifications/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await updateSubdocument(
      userRegistrationId,
      subDocId,
      "certifications",
      req.body,
      res
    );
  }
);

router.delete(
  "/delete-certifications/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await deleteSubdocument(
      userRegistrationId,
      subDocId,
      "certifications",
      res
    );
  }
);

// Projects Routes
router.post(
  "/add-projects/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    await addSubdocument(userRegistrationId, "projects", req.body, res);
  }
);

router.put(
  "/update-projects/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await updateSubdocument(
      userRegistrationId,
      subDocId,
      "projects",
      req.body,
      res
    );
  }
);

router.delete(
  "/delete-projects/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await deleteSubdocument(userRegistrationId, subDocId, "projects", res);
  }
);

// Languages Routes
router.post(
  "/add-languages/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    const { language } = req.body;
    await addStringToArray(userRegistrationId, "languages", language, res);
  }
);

router.delete(
  "/delete-languages/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
    const { language } = req.body;
    await deleteStringFromArray(userRegistrationId, "languages", language, res);
  }
);

module.exports = router;
