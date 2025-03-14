const Router = require("express");
const router = Router();
const BookmarkedJob = require("../models/BookmarkedJobs");
const authorize = require("../middleware/roleMiddleware");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");
const logger = require("../utils/logger"); //Logger import
// const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");

// Route to save the job
/**
 * @route POST /:jobId/bookmarked-job
 * @description Bookmarks a job for a job seeker.
 * @access Private (Job Seeker only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.jobId - ID of the job to be bookmarked
 * @param {Object} req.user - Authenticated user data
 * @param {string} req.user.id - ID of the job seeker
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response
 * @throws {Error} If an internal server error occurs
 */
router.post(
  "/:jobId/bookmarked-job",
  authorize("jobSeeker"),
  async (req, res) => {
    const userId = req.user?.id;
    const {
      params: { jobId },
    } = req;
    try {
      const existingBookmark = await BookmarkedJob.findOne({ userId, jobId });
      if (existingBookmark) {
        return res.status(400).json({ msg: "Already Bookmarked" });
      }

      const bookmark = new BookmarkedJob({ userId, jobId });
      await bookmark.save();

      const cacheKeyUser = `/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/${userId}`;
      await invalidateCache(cacheKeyUser);

      res.status(201).json({
        success: true,
        msg: "Job bookmarked successfully",
        bookmark,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while bookmarking the job",
        error: error.message,
      });
    }
  }
);

// Route to unsave the job
/**
 * @route DELETE /:jobId/unbookmark-job
 * @description Removes a bookmarked job for a job seeker.
 * @access Private (Job Seeker only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.jobId - ID of the job to be unbookmarked
 * @param {Object} req.user - Authenticated user data
 * @param {string} req.user.id - ID of the job seeker
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response
 * @throws {Error} If an internal server error occurs
 */
router.delete(
  "/:jobId/unbookmark-job",
  authorize("jobSeeker"),
  async (req, res) => {
    const userId = req.user?.id;
    const {
      params: { jobId },
    } = req;
    try {
      await BookmarkedJob.findOneAndDelete({ userId, jobId });

      const cacheKeyUser = `/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/${userId}`;
      await invalidateCache(cacheKeyUser);

      res.status(204).json({
        success: true,
        msg: "Job unsaved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while unsaving the job",
        error: error.message,
      });
    }
  }
);

// Route to fetch the saved jobs my particular user
/**
 * @route GET /fetch-bookmarked-jobs
 * @description Retrieves all bookmarked jobs for a job seeker.
 * @access Private (Job Seeker only)
 * @middleware authorize("jobSeeker")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user data
 * @param {string} req.user.id - ID of the job seeker
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response containing the list of bookmarked jobs
 * @throws {Error} If an internal server error occurs
 */
router.get(
  "/fetch-bookmarked-jobs",
  authorize("jobSeeker"),
  async (req, res) => {
    try {
      // const { params: { userId } } = req;
      const userId = req.user?.id;
      const cacheKey = `/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/${userId}`;
      logger.info(`Cache Key: ${cacheKey}`);

      // Fetch data with cache handling
      const cachedResponse = await cacheQueryJob(
        cacheKey,
        async () => {
          const bookmarked = await BookmarkedJob.find({ userId });
          return bookmarked.length ? bookmarked : null; // Return empty array if no jobs found
        },
        cacheConfig.defaultTTL
      );

      if (cachedResponse.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No jobs found for this employer",
        });
      }
      // const bookmarked = await BookmarkedJob.find({ userId });
      // if (!bookmarked) {
      //   return res.status(404).json({ msg: "No bookmarked jobs" });
      // }
      res.status(200).json({
        success: true,
        bookmarked: cachedResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching the bookmarked jobs",
        error: error.message,
      });
    }
  }
);

module.exports = router;
