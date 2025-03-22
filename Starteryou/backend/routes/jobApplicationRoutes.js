const Router = require("express");
const router = Router();
const authorize = require("../middleware/roleMiddleware");
const {
  applyJobHandler,
  fetchAppliedJobHandler,
  fetchAppliedUsersHandler,
  updateAppliedJobStatusHandler,
} = require("../handlers/JobApplicationHandlers");

/**
 * @route POST /:jobId/apply-job
 * @description Apply for a job as an authenticated job seeker
 * @access Private (jobSeeker)
 * @param {string} jobId - The ID of the job to apply for
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler applyJobHandler - Handles the job application logic
 */
router.post("/:jobId/apply-job", authorize("jobSeeker"), applyJobHandler);

/**
 * @route GET /fetch-applied-jobs
 * @description Retrieve all jobs applied by the authenticated job seeker
 * @access Private (jobSeeker)
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler fetchAppliedJobHandler - Handles fetching applied jobs
 */
router.get(
  "/fetch-applied-jobs",
  authorize("jobSeeker"),
  fetchAppliedJobHandler
);

/**
 * @route GET /fetch-applied-users/:jobId
 * @description Retrieve all users who have applied for a specific job
 * @access Private (employer)
 * @param {string} jobId - The ID of the job to fetch applied users for
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler fetchAppliedUsersHandler - Handles fetching applied users
 */
router.get(
  "/fetch-applied-users/:jobId",
  authorize("employer"),
  fetchAppliedUsersHandler
);

/**
 * @route PATCH /change-job-status/:applicationId
 * @description Update the status of a job application
 * @access Private (employer)
 * @param {string} applicationId - The ID of the application to update
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler updateAppliedJobStatusHandler - Handles updating the application status
 */
router.patch(
  "/change-job-status/:applicationId",
  authorize("employer"),
  updateAppliedJobStatusHandler
);

module.exports = router;
