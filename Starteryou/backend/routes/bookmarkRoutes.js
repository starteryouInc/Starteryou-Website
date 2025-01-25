const Router = require("express");
const router = Router();
const BookmarkedJob = require("../models/BookmarkedJobs");
const authorize = require("../middleware/roleMiddleware");

// Route to bookmark the job
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
      res.status(201).json({
        success: true,
        msg: "Job bookmarked successfully",
        bookmark,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while bookmarking the job",
        error,
      });
    }
  }
);

// Route to fetch the bookmark jobs my particular user
router.get(
  "/fetch-bookmarked-jobs",
  authorize("jobSeeker"),
  async (req, res) => {
    try {
      // const { params: { userId } } = req;
      const userId = req.user?.id;
      const bookmarked = await BookmarkedJob.find({ userId });
      if (!bookmarked) {
        return res.status(404).json({ msg: "No bookmarked jobs" });
      }
      res.status(200).json({
        success: true,
        bookmarked,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching the bookmarked jobs",
        error,
      });
    }
  }
);

module.exports = router;
