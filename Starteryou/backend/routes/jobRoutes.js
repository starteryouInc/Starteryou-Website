const Router = require("express");
const router = Router();
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");

const {
  fetchJobByIDHandler,
  fetchJobHandler,
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
  fetchPostedJobsHandler,
} = require("../handlers/JobHandlers");

/**
 * @route POST /create-job
 * @description Create a new job posting for the authenticated employer
 * @access Private (employer)
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler createJobHandler - Handles the job creation logic
 */
router.post("/create-job", authorize("employer"), createJobHandler);

/**
 * @route GET /fetch-job
 * @description Fetch all available jobs based on query parameters
 * @access Private (jobSeeker, employer)
 * @middleware authorize - Ensures that the user has the "jobSeeker" or "employer" role
 * @middleware cacheMiddlewareJob - Applies caching for optimized performance
 * @handler fetchJobHandler - Handles fetching available jobs
 */
router.get(
  "/fetch-job",
  authorize("jobSeeker", "employer"),
  cacheMiddlewareJob, // Apply caching middleware
  fetchJobHandler
);

/**
 * @route GET /fetch-job/:id
 * @description Fetch job details by job ID
 * @access Private (jobSeeker, employer)
 * @param {string} id - The ID of the job to be fetched
 * @middleware authorize - Ensures that the user has the "jobSeeker" or "employer" role
 * @handler fetchJobByIDHandler - Handles fetching job details by ID
 */
router.get(
  "/fetch-job/:id",
  authorize("jobSeeker", "employer"),
  fetchJobByIDHandler
);

/**
 * @route PUT /update-job/:id
 * @description Update an existing job posting by job ID
 * @access Private (employer)
 * @param {string} id - The ID of the job to be updated
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler updateJobHandler - Handles updating the job
 */
router.put("/update-job/:id", authorize("employer"), updateJobHandler);

/**
 * @route DELETE /delete-job/:id
 * @description Delete an existing job posting by job ID
 * @access Private (employer)
 * @param {string} id - The ID of the job to be deleted
 * @middleware authorize - Ensures that the user has the "employer" role
 * @handler deleteJobHandler - Handles deleting the job
 */
router.delete("/delete-job/:id", authorize("employer"), deleteJobHandler);

/**
 * @route GET /fetch-posted-jobs/:userId
 * @description Retrieve all jobs posted by a specific employer
 * @access Private (employer)
 * @param {string} userId - The ID of the employer whose posted jobs are being fetched
 * @middleware authorize - Ensures that the user has the "employer" role
 * @middleware cacheMiddlewareJob - Applies caching for optimized performance
 * @handler fetchPostedJobsHandler - Handles fetching posted jobs
 */
router.get(
  "/fetch-posted-jobs/:userId",
  authorize("employer"),
  cacheMiddlewareJob,
  fetchPostedJobsHandler
);

module.exports = router;
