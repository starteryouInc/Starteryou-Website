const Router = require("express");
const router = Router();
const Job = require("../models/Job");
const authorize = require("../middleware/roleMiddleware");
const cacheMiddlewareJob = require("../cache/utils/cacheMiddlewareJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const cacheConfig = require("../cache/config/cacheConfig");

router.post("/create-job", authorize("employer"), async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      title,
      description,
      location,
      industry,
      jobType,
      experienceLevel,
      workplaceType,
      startDate,
      endDate,
      salaryRange,
      frequency,
      companyName,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !industry ||
      !jobType ||
      !experienceLevel ||
      !workplaceType ||
      !salaryRange?.min ||
      !salaryRange?.max ||
      !frequency ||
      !companyName
    ) {
      return res.status(400).json({
        success: false,
        msg: "All required fields must be filled.",
      });
    }

    // Validate salary range (min should be less than max)
    if (
      salaryRange.min <= 0 ||
      salaryRange.max <= 0 ||
      salaryRange.min >= salaryRange.max
    ) {
      return res.status(400).json({
        success: false,
        msg: "Salary range must be valid. Minimum salary should be less than maximum salary.",
      });
    }
    const newJob = new Job({ ...req.body, postedBy: userId });

    const response = await newJob.save();

    const cacheKeyUser = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
    const cacheKeyGlobal = `/api/v1/jobportal/jobs/fetch-posted-jobs`;

    const cacheKeyGlobalJob = `/api/v1/jobportal/jobs/fetch-job?{}`;
    const cacheKeyGlobalJobQuery = `/api/v1/jobportal/jobs/fetch-job`;
    // Invalidate all related cache keys
    await invalidateCache(cacheKeyUser);
    await invalidateCache(cacheKeyGlobal);

    await invalidateCache(cacheKeyGlobalJob);
    await invalidateCache(cacheKeyGlobalJobQuery);

    res.status(201).json({
      success: true,
      msg: "New Job created successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while listing New Job",
      error: error.message,
    });
  }
});

router.get(
  "/fetch-job",
  authorize("jobSeeker", "employer"),
  cacheMiddlewareJob, // Apply caching middleware
  async (req, res) => {
    try {
      const {
        location,
        industry,
        jobType,
        experienceLevel,
        salaryMin,
        salaryMax,
        keyword,
      } = req.query;

      // Construct cache key based on query parameters
      const cacheKey = `/api/v1/jobportal/jobs/fetch-job?${JSON.stringify(
        req.query
      )}`;
      console.log(`Cache Key: ${cacheKey}`);

      // Define query filters
      const filters = {};
      if (location) filters.location = location;
      if (industry) filters.industry = industry;
      if (jobType) filters.jobType = jobType;
      if (experienceLevel) filters.experienceLevel = experienceLevel;
      if (salaryMin || salaryMax) {
        filters.salaryRange = {};
        if (salaryMin) filters.salaryRange.min = { $gte: Number(salaryMin) };
        if (salaryMax) filters.salaryRange.max = { $lte: Number(salaryMax) };
      }
      if (keyword) {
        filters.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      }

      // Check cache before querying database
      const cachedResponse = await cacheQueryJob(
        cacheKey,
        async () => {
          const jobs = await Job.find(filters);
          if (!jobs || jobs.length === 0) {
            throw new Error("No jobs found"); // Prevents caching empty results
          }
          return jobs;
        },
        cacheConfig.defaultTTL
      );

      if (!cachedResponse) {
        return res.status(404).json({
          success: false,
          dataLength: 0,
          message: "No jobs found matching the query.",
        });
      }

      res.status(200).json({
        success: true,
        dataLength: cachedResponse.length,
        msg: "Jobs are fetched successfully ( cached )",
        data: cachedResponse,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occurred while fetching jobs",
        error: error.message,
      });
    }
  }
);

router.get(
  "/fetch-job/:id",
  authorize("jobSeeker", "employer"),
  async (req, res) => {
    const {
      params: { id },
    } = req;
    try {
      const fetchJobById = await Job.findById(id);
      if (!fetchJobById) {
        return res.status(404).json({ msg: "No job found by particular ID" });
      }
      res.status(200).json({
        success: true,
        msg: `Job fetched successfully with Id: ${id}"`,
        data: fetchJobById,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while fetching this Job",
        error: error.message,
      });
    }
  }
);

router.put("/update-job/:id", authorize("employer"), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const cacheKeyUser = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
    const cacheKeyGlobal = `/api/v1/jobportal/jobs/fetch-posted-jobs`;
    const cacheKeyGlobalJob = `/api/v1/jobportal/jobs/fetch-job?{}`;
    const cacheKeyGlobalJobQuery = `/api/v1/jobportal/jobs/fetch-job`;

    // Update the job and return the updated document
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Invalidate all related cache keys
    await invalidateCache(cacheKeyUser);
    await invalidateCache(cacheKeyGlobal);
    await invalidateCache(cacheKeyGlobalJob);
    await invalidateCache(cacheKeyGlobalJobQuery);

    res.status(200).json({
      success: true,
      msg: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error.message);
    res.status(500).json({
      success: false,
      msg: "Some error occurred while updating the job",
      error: error.message,
    });
  }
});

router.delete("/delete-job/:id", authorize("employer"), async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const deleteJob = await Job.findByIdAndDelete(id);
    if (!deleteJob) {
      return res.status(404).json({
        success: false,
        msg: "Job not found!",
      });
    }

    const userId = req.user?.id;
    const cacheKeyUser = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
    const cacheKeyGlobal = `/api/v1/jobportal/jobs/fetch-posted-jobs`;
    const cacheKeyGlobalJob = `/api/v1/jobportal/jobs/fetch-job?{}`;
    const cacheKeyGlobalJobQuery = `/api/v1/jobportal/jobs/fetch-job`;
    // Invalidate all related cache keys
    await invalidateCache(cacheKeyUser);
    await invalidateCache(cacheKeyGlobal);
    await invalidateCache(cacheKeyGlobalJob);
    await invalidateCache(cacheKeyGlobalJobQuery);

    res.status(200).json({
      success: true,
      msg: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while deleting the job",
      error: error.message,
    });
  }
});

router.get(
  "/fetch-posted-jobs",
  authorize("employer"),
  cacheMiddlewareJob,
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const cacheKey = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
      console.log(`Cache Key: ${cacheKey}`);

      // Fetch data with cache handling
      const cachedResponse = await cacheQueryJob(
        cacheKey,
        async () => {
          const postedJobs = await Job.find({ postedBy: userId });
          return postedJobs.length ? postedJobs : null; // Return empty array if no jobs found
        },
        cacheConfig.defaultTTL
      );

      if (cachedResponse.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No jobs found for this employer",
        });
      }

      res.status(200).json({
        success: true,
        length: cachedResponse.length,
        msg: "Posted jobs fetched successfully",
        data: cachedResponse,
      });
    } catch (error) {
      console.error("Error fetching posted jobs:", error.message);
      res.status(500).json({
        success: false,
        msg: "Some error occurred while fetching the posted jobs",
        error: error.message,
      });
    }
  }
);

module.exports = router;
