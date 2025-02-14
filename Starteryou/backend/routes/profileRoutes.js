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

// Route to create the profile of the user
/**
 * @route POST /create-profile
 * @description Creates a new job seeker profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.userRegistrationId - User's unique registration ID (required)
 * @param {string} req.body.name - User's full name (required)
 * @param {string} req.body.email - User's email address (required)
 * @param {string} [req.body.phoneNo] - User's phone number (optional)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with created profile data
 * @throws {Error} If required fields are missing or an internal server error occurs
 */

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

// Route to fetch the full profile of the user
/**
 * @route GET /fetch-profile/:userId
 * @description Fetches the profile of a specific user by user ID.
 * @access Private (Job Seekers and Employers only)
 * @middleware authorize("jobSeeker", "employer")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - The user registration ID to fetch the profile (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with the user's profile data
 * @throws {Error} If no profile is found or an internal server error occurs
 */

router.get(
  "/fetch-profile/:userId",
  authorize("jobSeeker", "employer"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    try {
      const fetchProfile = await UserProfile.find({
        userRegistrationId: userId,
      });
      if (!fetchProfile || fetchProfile.length === 0) {
        return res.status(404).json({ msg: "No profile found!" });
      }
      res.status(200).json({
        success: true,
        dataLength: fetchProfile.length,
        msg: "Profiles fetched successfully",
        data: fetchProfile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching the Profiles",
        error,
      });
    }
  }
);

/**
 * @route PATCH /update-profile/:userRegistrationId
 * @description Updates a job seeker's profile with the provided details.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose profile is being updated (required)
 * @param {string} [req.body.professionalTitle] - Updated professional title
 * @param {string} [req.body.location] - Updated location
 * @param {string} [req.body.currentCompany] - Updated current company
 * @param {string} [req.body.totalExperience] - Updated total experience
 * @param {string} [req.body.phoneNo] - Updated phone number
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with updated profile data
 * @throws {Error} If the profile is not found or an internal server error occurs
 */

router.patch(
  "/update-profile/:userRegistrationId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId },
    } = req;
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
        {
          new: true,
        }
      );
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          msg: "User Profile not found!",
        });
      }
      res.status(200).json({
        success: true,
        msg: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while updating the profile",
        error,
      });
    }
  }
);

/**
 * @route GET /get-profile-fields/:userRegistrationId
 * @description Fetches a specific field from a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose profile field is being fetched (required)
 * @param {string} req.query.field - The specific profile field to fetch (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with the requested profile field data
 * @throws {Error} If the user is not found, the field is invalid, or an internal server error occurs
 *
 * @validFields ["workExperience", "educationDetails", "skills", "certifications", "projects", "languages"]
 */

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
      // Fetch only the requested field
      const user = await UserProfile.findOne(
        { userRegistrationId },
        { [field]: 1, _id: 0 } // Only return the requested field
      );

      if (!user) {
        return res.status(404).json({ msg: "User not found!" });
      }
      res.status(200).json({
        success: true,
        msg: `${field} fetched successfully`,
        data: user[field],
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
/**
 * @route POST /add-workExperience/:userRegistrationId
 * @description Adds a new work experience entry to a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user to whom the work experience will be added (required)
 * @param {Object} req.body - The work experience details to be added (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the work experience entry was added successfully
 * @throws {Error} If the user is not found or an internal server error occurs
 *
 * @function addSubdocument - Utility function to add a subdocument (workExperience) to the user's profile
 */

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

/**
 * @route PUT /update-workExperience/:userRegistrationId/:subDocId
 * @description Updates a specific work experience entry in a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose work experience is being updated (required)
 * @param {string} req.params.subDocId - The ID of the specific work experience entry to be updated (required)
 * @param {Object} req.body - The updated work experience details (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the work experience entry was updated successfully
 * @throws {Error} If the user or work experience entry is not found, or an internal server error occurs
 *
 * @function updateSubdocument - Utility function to update a subdocument (workExperience) in the user's profile
 */

router.put(
  "/update-workExperience/:userRegistrationId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userRegistrationId, subDocId },
    } = req;
    await updateSubdocument(
      userRegistrationId,
      subDocId,
      "workExperience",
      req.body,
      res
    );
  }
);

/**
 * @route DELETE /delete-workExperience/:userRegistrationId/:subDocId
 * @description Deletes a specific work experience entry from a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose work experience entry is being deleted (required)
 * @param {string} req.params.subDocId - The ID of the specific work experience entry to be deleted (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the work experience entry was deleted successfully
 * @throws {Error} If the user or work experience entry is not found, or an internal server error occurs
 *
 * @function deleteSubdocument - Utility function to remove a subdocument (workExperience) from the user's profile
 */

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

/**
 * @route DELETE /delete-educationDetails/:userRegistrationId/:subDocId
 * @description Deletes a specific education detail entry from a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose education detail is being deleted (required)
 * @param {string} req.params.subDocId - The ID of the specific education detail entry to be deleted (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the education detail entry was deleted successfully
 * @throws {Error} If the user or education detail entry is not found, or an internal server error occurs
 *
 * @function deleteSubdocument - Utility function to remove a subdocument (educationDetails) from the user's profile
 */

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
/**
 * @route POST /add-projects/:userRegistrationId
 * @description Adds a new project entry to a job seeker's profile.
 * @access Private (Job Seekers only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.userRegistrationId - The ID of the user whose project is being added (required)
 * @param {Object} req.body - The project details to be added (required)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response confirming the project was added successfully
 * @throws {Error} If the user is not found or an internal server error occurs
 *
 * @function addSubdocument - Utility function to add a subdocument (projects) to the user's profile
 */

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
