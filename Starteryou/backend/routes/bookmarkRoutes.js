const Router = require("express");
const router = Router();
const authorize = require("../middleware/roleMiddleware");
const {
  bookmarkedJobHandler,
  deleteBookmarkHandler,
  fetchBookmarkJobsHandler,
} = require("../handlers/BookmarkHandlers");

/**
 * @route POST /:jobId/bookmarked-job
 * @description Bookmark a job for the authenticated job seeker
 * @access Private (jobSeeker)
 * @param {string} jobId - The ID of the job to be bookmarked
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler bookmarkedJobHandler - Handles the job bookmarking logic
 */
router.post(
  "/:jobId/bookmarked-job",
  authorize("jobSeeker"),
  bookmarkedJobHandler
);

/**
 * @route DELETE /:jobId/unbookmark-job
 * @description Remove a bookmarked job for the authenticated job seeker
 * @access Private (jobSeeker)
 * @param {string} jobId - The ID of the job to be unbookmarked
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler deleteBookmarkHandler - Handles the unbookmarking logic
 */
router.delete(
  "/:jobId/unbookmark-job",
  authorize("jobSeeker"),
  deleteBookmarkHandler
);

/**
 * @route GET /fetch-bookmarked-jobs
 * @description Retrieve all bookmarked jobs for the authenticated job seeker
 * @access Private (jobSeeker)
 * @middleware authorize - Ensures that the user has the "jobSeeker" role
 * @handler fetchBookmarkJobsHandler - Handles fetching bookmarked jobs
 */
router.get(
  "/fetch-bookmarked-jobs",
  authorize("jobSeeker"),
  fetchBookmarkJobsHandler
);

module.exports = router;
