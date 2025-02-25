const Router = require("express");
const router = Router();
const BookmarkedJob = require("../models/BookmarkedJobs");
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");

// Route to save the job
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

      res.status(201).json({
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
router.get(
  "/fetch-bookmarked-jobs",
  authorize("jobSeeker"),
  async (req, res) => {
    try {
      // const { params: { userId } } = req;
      const userId = req.user?.id;
      const cacheKey = `/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/${userId}`;
      console.log(`Cache Key: ${cacheKey}`);

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
