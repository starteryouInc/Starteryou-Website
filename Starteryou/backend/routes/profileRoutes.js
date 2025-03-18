const Router = require("express");
const router = Router();
const {
  addSubdocument,
  updateSubdocument,
  deleteSubdocument,
  addStringToArray,
  deleteStringFromArray,
} = require("../services/userProfileService");
const authorize = require("../middleware/roleMiddleware");
const {
  createProfileHandler,
  fetchProfileHandler,
  updateProfileHandler,
  fetchProfileFieldsHandler,
} = require("../handlers/ProfileHandlers");

/**
 * @route POST /create-profile
 * @description Create a profile for the authenticated job seeker
 * @access Private (jobSeeker)
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler createProfileHandler - Handles the profile creation logic
 */
router.post("/create-profile", authorize("jobSeeker"), createProfileHandler);

/**
 * @route GET /fetch-profile/:userId
 * @description Fetch the profile of a user by user ID
 * @access Private (jobSeeker, employer)
 * @param {string} userId - The ID of the user whose profile is being fetched
 * @middleware authorize - Ensures that the user has the "jobSeeker" or "employer" role
 * @handler fetchProfileHandler - Handles fetching the user profile
 */
router.get(
  "/fetch-profile/:userId",
  authorize("jobSeeker", "employer"),
  fetchProfileHandler
);

/**
 * @route PATCH /update-profile/:userRegistrationId
 * @description Update a job seeker's profile by user registration ID
 * @access Private (jobSeeker)
 * @param {string} userRegistrationId - The ID of the registered user whose profile is being updated
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler updateProfileHandler - Handles updating the profile
 */
router.patch(
  "/update-profile/:userRegistrationId",
  authorize("jobSeeker"),
  updateProfileHandler
);

/**
 * @route GET /get-profile-fields/:userRegistrationId
 * @description Fetch specific profile fields for a registered user
 * @access Private (jobSeeker)
 * @param {string} userRegistrationId - The ID of the registered user whose profile fields are being fetched
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler fetchProfileFieldsHandler - Handles fetching profile fields
 */
router.get(
  "/get-profile-fields/:userRegistrationId",
  authorize("jobSeeker"),
  fetchProfileFieldsHandler
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

/**
 * @route DELETE /delete-languages/:userRegistrationId
 * @description Removes a specific language from a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose language is being removed (required)
 * @param {string} req.body.language - The language to be removed (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the language was removed successfully
 * @throws {Error} If the user is not found or an internal server error occurs
 *
 * @function deleteStringFromArray - Utility function to remove a string (language) from an array in the user's profile
 */
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
