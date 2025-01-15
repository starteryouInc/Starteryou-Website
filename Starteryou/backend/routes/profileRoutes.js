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
router.post("/create-profile", authorize("jobSeeker"), async (req, res) => {
  try {
    const newProfile = new UserProfile(req.body);
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
router.get(
  "/fetch-profile",
  authorize("jobSeeker", "employer"),
  async (req, res) => {
    try {
      const fetchProfile = await UserProfile.find();
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

// Work Experience Routes
router.post(
  "/add-workExperience/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    await addSubdocument(userId, "workExperience", req.body, res);
  }
);

router.put(
  "/update-workExperience/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await updateSubdocument(userId, subDocId, "workExperience", req.body, res);
  }
);

router.delete(
  "/delete-workExperience/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await deleteSubdocument(userId, subDocId, "workExperience", res);
  }
);

// Education Details Routes
router.post(
  "/add-educationDetails/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    await addSubdocument(userId, "educationDetails", req.body, res);
  }
);

router.put(
  "/update-educationDetails/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await updateSubdocument(
      userId,
      subDocId,
      "educationDetails",
      req.body,
      res
    );
  }
);

router.delete(
  "/delete-educationDetails/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await deleteSubdocument(userId, subDocId, "educationDetails", res);
  }
);

// Skills Routes
router.post("/add-skills/:userId", authorize("jobSeeker"), async (req, res) => {
  const {
    params: { userId },
  } = req;
  const { skill } = req.body;
  await addStringToArray(userId, "skills", skill, res);
});

router.delete(
  "/delete-skills/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    const { skill } = req.body;
    await deleteStringFromArray(userId, "skills", skill, res);
  }
);

// Certificates Routes
router.post(
  "/add-certifications/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    await addSubdocument(userId, "certifications", req.body, res);
  }
);

router.put(
  "/update-certifications/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await updateSubdocument(userId, subDocId, "certifications", req.body, res);
  }
);

router.delete(
  "/delete-certifications/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await deleteSubdocument(userId, subDocId, "certifications", res);
  }
);

// Projects Routes
router.post(
  "/add-projects/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    await addSubdocument(userId, "projects", req.body, res);
  }
);

router.put(
  "/update-projects/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await updateSubdocument(userId, subDocId, "projects", req.body, res);
  }
);

router.delete(
  "/delete-projects/:userId/:subDocId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId, subDocId },
    } = req;
    await deleteSubdocument(userId, subDocId, "projects", res);
  }
);

// Languages Routes
router.post(
  "/add-languages/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    const { language } = req.body;
    await addStringToArray(userId, "languages", language, res);
  }
);

router.delete(
  "/delete-languages/:userId",
  authorize("jobSeeker"),
  async (req, res) => {
    const {
      params: { userId },
    } = req;
    const { language } = req.body;
    await deleteStringFromArray(userId, "languages", language, res);
  }
);

module.exports = router;
