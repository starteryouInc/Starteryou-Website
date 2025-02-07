const Router = require("express");
const router = Router();
const Job = require("../models/Job");
const authorize = require("../middleware/roleMiddleware");

router.post("/create-job", authorize("employer"), async (req, res) => {
  const userId = req.user.id;
  try {
    const newJob = new Job({ ...req.body, postedBy: userId });
    // const newJob = new Job(req.body);
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
