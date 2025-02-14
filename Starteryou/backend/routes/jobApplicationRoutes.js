const Router = require("express");
const router = Router();
const Application = require("../models/JobApplications");
const authorize = require("../middleware/roleMiddleware");

// Route to apply for the job
/**
 * @route POST /:jobId/apply-job
 * @description Submits a job application for the given job ID.
 * @access Private (Job Seeker only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.jobId - ID of the job being applied for
 * @param {Object} req.body - Request body containing application details
 * @param {string} req.body.firstName - Applicant's first name (Required)
 * @param {string} req.body.lastName - Applicant's last name (Required)
 * @param {string} req.body.email - Applicant's email (Required)
 * @param {string} [req.body.whyHire] - Applicant's reason for applying (Optional)
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and application data
 * @throws {Error} If required fields are missing, user has already applied, or an internal server error occurs
 */
router.post("/:jobId/apply-job", authorize("jobSeeker"), async (req, res) => {
  const { firstName, lastName, email, whyHire } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      msg: "Required fields (firstName, lastName, email) are missing!",
    });
  }
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

    const application = new Application({
      userId,
      jobId,
      firstName,
      lastName,
      email,
      whyHire,
    });
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
      error: error.message,
    });
  }
});

// Route to fetch all the applied jobs by the particular user
/**
 * @route GET /fetch-applied-jobs
 * @description Fetches all jobs the authenticated job seeker has applied for.
 * @access Private (Job Seeker only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the authenticated job seeker
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and a list of applied jobs
 * @throws {Error} If no applications are found or an internal server error occurs
 */
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
      error: error.message,
    });
  }
});

// Route to fetch all the users who have applied to a particular job posted by the employer
/**
 * @route GET /fetch-applied-users/:jobId
 * @description Fetches all users who have applied for a specific job.
 * @access Private (Employer only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.jobId - ID of the job to fetch applicants for
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and a list of users who applied for the job
 * @throws {Error} If no users have applied or an internal server error occurs
 */
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
        error: error.message,
      });
    }
  }
);

// Route to update the status of the applied jobs by the employer who created that particular job
/**
 * @route PATCH /change-job-status/:applicationId
 * @description Updates the status of a job application.
 * @access Private (Employer only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.applicationId - ID of the job application to update
 * @param {Object} req.body - Request body
 * @param {string} req.body.status - New status of the application ("applied", "shortlisted", "rejected")
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and updated application details
 * @throws {Error} If an invalid status is provided, the application is not found, or an internal server error occurs
 */
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
        error: error.message,
      });
    }
  }
);

module.exports = router;
