const cacheConfig = require("../cache/config/cacheConfig");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const Job = require("../models/Job");
const logger = require("../utils/logger"); // Logger import

const createJobHandler = async (req, res) => {
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
    // All cacheKeys that needs to be deleted
    const cacheKeyUser = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
    const cacheKeyGlobal = `/api/v1/jobportal/jobs/fetch-posted-jobs`;
    const cacheKeyGlobalJob = `/api/v1/jobportal/jobs/fetch-job?{}`;
    const cacheKeyGlobalJobQuery = `/api/v1/jobportal/jobs/fetch-job`;

    // Invalidate all related cache keys
    await invalidateCache(cacheKeyUser);
    await invalidateCache(cacheKeyGlobal);
    await invalidateCache(cacheKeyGlobalJob);
    await invalidateCache(cacheKeyGlobalJobQuery);

    const newJob = new Job({ ...req.body, postedBy: userId });
    const response = await newJob.save();

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
};

const fetchJobHandler = async (req, res) => {
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
    logger.info(`Cache Key: ${cacheKey}`);

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
        // const jobs = await Job.find(filters);
        // if (!jobs || jobs.length === 0) {
        //   throw new Error("No jobs found"); // Prevents caching empty results
        // }
        // return jobs;
        return await Job.find(filters);
      },
      cacheConfig.defaultTTL
    );

    if (!Array.isArray(cachedResponse) || cachedResponse.length === 0) {
      return res.status(404).json({
        success: false,
        dataLength: 0,
        msg: "No jobs found.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      dataLength: cachedResponse.length,
      msg: "Jobs are fetched successfully (cached)",
      data: cachedResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occurred while fetching jobs",
      error: error.message,
    });
  }
};

const fetchJobByIDHandler = async (req, res) => {
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
};

const updateJobHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Update the job and return the updated document
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // All cacheKeys that needs to be deleted
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
      msg: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    // logger.error("Error updating job:", error.message);
    res.status(500).json({
      success: false,
      msg: "Some error occurred while updating the job",
      error: error.message,
    });
  }
};

const deleteJobHandler = async (req, res) => {
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
    // All cacheKeys that needs to be deleted
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
};

const fetchPostedJobsHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Construct cacheKey based on this route function
    const cacheKey = `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`;
    logger.info(`Cache Key: ${cacheKey}`);

    // Fetch data with cache handling
    const cachedResponse = await cacheQueryJob(
      cacheKey,
      async () => {
        const postedJobs = await Job.find({ postedBy: userId });
        return postedJobs.length ? postedJobs : null; // Return empty array if no jobs found
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
      length: cachedResponse.length,
      msg: "Posted jobs fetched successfully",
      data: cachedResponse,
    });
  } catch (error) {
    // logger.error("Error fetching posted jobs:", error.message);
    res.status(500).json({
      success: false,
      msg: "Some error occurred while fetching the posted jobs",
      error: error.message,
    });
  }
};

module.exports = {
  createJobHandler,
  fetchJobHandler,
  fetchJobByIDHandler,
  updateJobHandler,
  deleteJobHandler,
  fetchPostedJobsHandler,
};
