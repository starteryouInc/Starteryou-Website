const cacheConfig = require("../cache/config/cacheConfig");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const BookmarkedJob = require("../models/BookmarkedJobs");
const logger = require("../utils/logger"); // Logger import

/**
 * @desc    Bookmark a job for the logged-in user
 * @route   POST /api/v1/jobportal/bookmarks/:jobId
 * @access  Private (Authenticated Users)
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - The authenticated user object
 * @param   {string} req.user.id - The ID of the logged-in user
 * @param   {Object} req.params - Request parameters
 * @param   {string} req.params.jobId - The ID of the job to be bookmarked
 * @param   {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
const bookmarkedJobHandler = async (req, res) => {
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
      //   bookmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while bookmarking the job",
      error: error.message,
    });
  }
};

/**
 * @desc    Remove a bookmarked job for the logged-in user
 * @route   DELETE /api/v1/jobportal/bookmarks/:jobId
 * @access  Private (Authenticated Users)
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - The authenticated user object
 * @param   {string} req.user.id - The ID of the logged-in user
 * @param   {Object} req.params - Request parameters
 * @param   {string} req.params.jobId - The ID of the job to be removed from bookmarks
 * @param   {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
const deleteBookmarkHandler = async (req, res) => {
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
};

/**
 * @desc    Fetch all bookmarked jobs for the logged-in user
 * @route   GET /api/v1/jobportal/bookmarks
 * @access  Private (Authenticated Users)
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - The authenticated user object
 * @param   {string} req.user.id - The ID of the logged-in user
 * @param   {Object} res - Express response object
 * @returns {Object} JSON response with an array of bookmarked jobs or an error
 */
const fetchBookmarkJobsHandler = async (req, res) => {
  try {
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

    if (!cachedResponse || cachedResponse.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No jobs found for this employer",
      });
    }
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
};

module.exports = {
  bookmarkedJobHandler,
  deleteBookmarkHandler,
  fetchBookmarkJobsHandler,
};
