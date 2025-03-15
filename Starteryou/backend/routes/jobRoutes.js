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

router.post("/create-job", authorize("employer"), createJobHandler);

router.get(
  "/fetch-job",
  authorize("jobSeeker", "employer"),
  cacheMiddlewareJob, // Apply caching middleware
  fetchJobHandler
);

router.get(
  "/fetch-job/:id",
  authorize("jobSeeker", "employer"),
  fetchJobByIDHandler
);

router.put("/update-job/:id", authorize("employer"), updateJobHandler);

router.delete("/delete-job/:id", authorize("employer"), deleteJobHandler);

router.get(
  "/fetch-posted-jobs/:userId",
  authorize("employer"),
  cacheMiddlewareJob,
  fetchPostedJobsHandler
);

module.exports = router;
