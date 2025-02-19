const Router = require("express");
const router = Router();
const Job = require("../models/Job");
const authorize = require("../middleware/roleMiddleware");

/**
 * @route POST /create-job
 * @description Creates a new job listing.
 * @access Private (Employer only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - ID of the employer creating the job
 * @param {Object} req.body - Job details
 * @param {string} req.body.title - Job title
 * @param {string} req.body.description - Job description
 * @param {string} req.body.location - Job location
 * @param {string} req.body.industry - Industry category
 * @param {string} req.body.jobType - Job type (e.g., full-time, part-time)
 * @param {string} req.body.experienceLevel - Required experience level
 * @param {string} req.body.workplaceType - Workplace type (e.g., remote, onsite, hybrid)
 * @param {string} req.body.startDate - Job start date
 * @param {string} req.body.endDate - Job end date
 * @param {Object} req.body.salaryRange - Salary range
 * @param {number} req.body.salaryRange.min - Minimum salary
 * @param {number} req.body.salaryRange.max - Maximum salary
 * @param {string} req.body.frequency - Salary payment frequency (e.g., monthly, yearly)
 * @param {string} req.body.companyName - Company name
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and created job details
 * @throws {Error} If required fields are missing, salary range is invalid, or an internal server error occurs
 */
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

/**
 * @route GET /fetch-job
 * @description Fetches job listings based on query parameters (filters).
 * @access Private (Job Seekers & Employers)
 * @middleware authorize("jobSeeker", "employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for filtering jobs
 * @param {string} [req.query.location] - Filter by job location
 * @param {string} [req.query.industry] - Filter by industry category
 * @param {string} [req.query.jobType] - Filter by job type (e.g., full-time, part-time)
 * @param {string} [req.query.experienceLevel] - Filter by required experience level
 * @param {number} [req.query.salaryMin] - Filter by minimum salary
 * @param {number} [req.query.salaryMax] - Filter by maximum salary
 * @param {string} [req.query.keyword] - Search keyword (matches job title or description)
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and job listings
 * @throws {Error} If no jobs are found or an internal server error occurs
 */

router.get(
  "/fetch-job",
  authorize("jobSeeker", "employer"),
  async (req, res) => {
    const {
      location,
      industry,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      keyword,
    } = req.query;
    try {
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

      const fetchJobs = await Job.find(filters);
      if (!fetchJobs) {
        return res.status(404).json({ msg: "No jobs in the database" });
      }

      if (fetchJobs.length === 0) {
        return res.status(404).json({
          success: false,
          dataLength: 0,
          message: "No jobs found matching the query.",
        });
      }
      res.status(200).json({
        success: true,
        dataLength: fetchJobs.length,
        msg: "Jobs are fetched successfully",
        data: fetchJobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Some error occured while listing New Job",
        error: error.message,
      });
    }
  }
);

/**
 * @route GET /fetch-job/:id
 * @description Fetches a job listing by its unique ID.
 * @access Private (Job Seekers & Employers)
 * @middleware authorize("jobSeeker", "employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Job ID to fetch
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and job details
 * @throws {Error} If the job is not found or an internal server error occurs
 */

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

/**
 * @route PUT /update-job/:id
 * @description Updates an existing job listing by its ID.
 * @access Private (Employers only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Job ID to update
 * @param {Object} req.body - Updated job details
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and updated job details
 * @throws {Error} If the job is not found or an internal server error occurs
 */

router.put("/update-job/:id", authorize("employer"), async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const findJob = await Job.findById(id);
    if (!findJob) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const updateJob = await findJob.updateOne(req.body);
    res.status(200).json({
      success: true,
      msg: "Job updated successfully",
      data: updateJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while updating the Jobs",
      error: error.message,
    });
  }
});

/**
 * @route DELETE /delete-job/:id
 * @description Deletes a job listing by its ID.
 * @access Private (Employers only)
 * @middleware authorize("employer")
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Job ID to delete
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with success status and deletion message
 * @throws {Error} If the job is not found or an internal server error occurs
 */

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

/**
 * @route GET /fetch-posted-jobs
 * @description Fetches all jobs posted by the authenticated employer.
 * @access Private (Employers only)
 * @middleware authorize("employer")
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - Employer's user ID
 * 
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response with the list of posted jobs
 * @throws {Error} If no jobs are found or an internal server error occurs
 */

router.get("/fetch-posted-jobs", authorize("employer"), async (req, res) => {
  try {
    const userId = req.user?.id;
    const postedJobs = await Job.find({ postedBy: userId });
    if (postedJobs.length === 0) {
      return res.status(404).json({ msg: "No jobs found for this employer" });
    }
    res.status(200).json({
      success: true,
      length: postedJobs.length,
      msg: "Posted jobs fetched successfully",
      data: postedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while fetching the posted jobs",
      error: error.message,
    });
  }
});

module.exports = router;
