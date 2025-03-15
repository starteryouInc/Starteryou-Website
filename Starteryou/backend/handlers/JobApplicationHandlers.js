const cacheConfig = require("../cache/config/cacheConfig");
const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const Application = require("../models/JobApplications");

const applyJobHandler = async (req, res) => {
  const { firstName, lastName, email, whyHire } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      msg: "Required fields (firstName, lastName, email) are missing!",
    });
  }
  try {
    const userId = req.user.id;
    const {
      params: { jobId },
    } = req;

    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ msg: "You have already applied to this Job" });
    }

    const application = new Application({
      userId,
      jobId,
      firstName,
      lastName,
      email,
      whyHire,
    });
    await application.save();

    const cacheKeyUser = `/api/v1/jobportal/applications/fetch-applied-jobs/${userId}`;
    await invalidateCache(cacheKeyUser);

    res.status(201).json({
      success: true,
      msg: "Application submitted successfully",
      //   application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while submitting the application",
      error: error.message,
    });
  }
};

const fetchAppliedJobHandler = async (req, res) => {
  try {
    // const { params: { userId } } = req;
    const userId = req.user?.id;
    const cacheKey = `/api/v1/jobportal/applications/fetch-applied-jobs/${userId}`;
    console.log(`Cache Key: ${cacheKey}`);

    // Fetch data with cache handling
    const cachedResponse = await cacheQueryJob(
      cacheKey,
      async () => {
        const applications = await Application.find({ userId });
        return applications.length ? applications : null; // Return empty array if no jobs found
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
      applications: cachedResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some occured while fetching the applications",
      error: error.message,
    });
  }
};

const fetchAppliedUsersHandler = async (req, res) => {
  const {
    params: { jobId },
  } = req;
  try {
    const userId = req.user?.id;
    const cacheKey = `/api/v1/jobportal/applications/fetch-applied-users/${userId}`;
    console.log(`Cache Key: ${cacheKey}`);

    // Fetch data with cache handling
    const cachedResponse = await cacheQueryJob(
      cacheKey,
      async () => {
        const applied = await Application.find({ jobId });
        return applied.length ? applied : null; // Return empty array if no jobs found
      },
      cacheConfig.defaultTTL
    );

    if (cachedResponse.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No jobs found for this employer",
      });
    }
    // const applied = await Application.find({ jobId });
    // if (!applied || applied.length === 0) {
    //   return res.status(400).json({ msg: "No one has applied to this job" });
    // }
    res.status(200).json({
      success: true,
      msg: "Fetched all user who have applied to this job",
      applied: cachedResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while fetching the users",
      error: error.message,
    });
  }
};

const updateAppliedJobStatusHandler = async (req, res) => {
  const {
    params: { applicationId },
  } = req;
  const { status } = req.body;

  const validStatuses = ["applied", "shortlisted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      msg: "Invalid status. Please provide one of the following: applied, shortlisted, rejected",
    });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ msg: "Application not found!" });
    }

    application.status = status;
    await application.save();

    // const cacheKeyUser = `/api/v1/jobportal/applications/fetch-applied-jobs/${userId}`;
    // await invalidateCache(cacheKeyUser);

    res.status(200).json({
      success: true,
      msg: "Application status updated successfully.",
      //   application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Some error occured while updating the application status.",
      error: error.message,
    });
  }
};

module.exports = {
  applyJobHandler,
  fetchAppliedJobHandler,
  fetchAppliedUsersHandler,
  updateAppliedJobStatusHandler,
};
