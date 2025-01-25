const Router = require("express");
const router = Router();
const Application = require("../models/JobApplications");
const authorize = require("../middleware/roleMiddleware");

// Route to apply for the job
router.post("/:jobId/apply-job", authorize("jobSeeker"), async (req, res) => {
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

// Route to fetch all the applied jobs by the particular user
router.get("/fetch-applied-jobs", authorize("jobSeeker"), async (req, res) => {
  try {
    // const { params: { userId } } = req;
    const userId = req.user?.id;
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

// Route to fetch all the users who have applied to a particular job posted by the employer
router.get(
  "/fetch-applied-users/:jobId",
  authorize("employer"),
  async (req, res) => {
    const {
      params: { jobId },
    } = req;
    try {
      const applied = await Application.find({ jobId });
      if (!applied || applied.length === 0) {
        return res.status(400).json({ msg: "No one has applied to this job" });
      }
      res.status(200).json({
        success: true,
        msg: "Fetched all user who have applied to this job",
        applied,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching the users",
        error,
      });
    }
  }
);

// Route to update the status of the applied jobs by the employer who created that particular job
router.patch(
  "/change-job-status/:applicationId",
  authorize("employer"),
  async (req, res) => {
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
  }
);

module.exports = router;
