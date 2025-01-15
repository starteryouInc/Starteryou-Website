const Router = require("express");
const router = Router();
const Application = require("../models/Application");
const authorize = require("../middleware/roleMiddleware");

router.post("/:jobId/apply", authorize("jobSeeker"), async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      params: { jobId },
    } = req;

    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ msg: "You have already applied to this Job" });
    }

    const application = new Application({ userId, jobId });
    await application.save();
    res.status(201).json({
      success: true,
      msg: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while submitting the application",
      error,
    });
  }
});

router.get("/:userId", authorize("jobSeeker"), async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId });
    if (!applications) {
      return res.status(404).json({ msg: "No applied Job application" });
    }
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some occured while fetching the applications",
      error,
    });
  }
});

router.patch("/:applicationId", authorize("employer"), async (req, res) => {
  const {
    params: { applicationId },
  } = req;
  const { status } = req.body;

  const validStatuses = ["applied", "shortlisted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      msg: "Invalid status. Please provide one of the following: applied, shortlisted, rejected",
    });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ msg: "Application not found!" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      msg: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while updating the application status.",
      error,
    });
  }
});

module.exports = router;
