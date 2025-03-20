const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const Job = require("../models/Job");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const {
  fetchJobByIDHandler,
  fetchJobHandler,
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
  fetchPostedJobsHandler,
} = require("../handlers/JobHandlers");

jest.mock("../models/Job");
jest.mock("../cache/utils/cacheQueryJob");
jest.mock("../cache/utils/invalidateCache");
jest.mock("../db", () => ({}));

// Test cases for fetchJobByIDHandler, fetchJobHandler, createJobHandler, updateJobHandler, deleteJobHandler, fetchPostedJobsHandler
describe("createJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {
        title: "Software Engineer",
        description: "Job description",
        location: "New York",
        industry: "Tech",
        jobType: "Full-time",
        experienceLevel: "Mid",
        workplaceType: "Remote",
        startDate: "2025-04-01",
        endDate: "2025-12-31",
        salaryRange: { min: 50000, max: 100000 },
        frequency: "Per Month",
        companyName: "TechCorp",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Create a job successfully
  it("should create a job successfully", async () => {
    const mockJob = { _id: "job123", ...req.body };
    Job.prototype.save.mockResolvedValue(mockJob);

    await createJobHandler(req, res);

    expect(invalidateCache).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "New Job created successfully",
      data: mockJob,
    });
  });

  // Test 2: Return 400 if required fields are missing
  it("should return 400 if required fields are missing", async () => {
    req.body.title = ""; // Missing title
    await createJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "All required fields must be filled.",
    });
  });

  // Test 3: Return 400 if salary range is invalid
  it("should return 400 if salary range is invalid", async () => {
    req.body.salaryRange = { min: 100000, max: 50000 }; // Invalid salary range
    await createJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Salary range must be valid. Minimum salary should be less than maximum salary.",
    });
  });

  // Test 4: Handle errors properly
  it("should handle errors properly", async () => {
    Job.prototype.save.mockRejectedValue(new Error("Database error"));

    await createJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while listing New Job",
      error: "Database error",
    });
  });
});

describe("fetchJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Fetch jobs successfully
  it("should fetch jobs successfully", async () => {
    const mockJobs = [{ id: 1, title: "Software Engineer" }];
    cacheQueryJob.mockResolvedValue(mockJobs);

    await fetchJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dataLength: 1,
      msg: "Jobs are fetched successfully (cached)",
      data: mockJobs,
    });
  });

  // Test 2: Return 404 if no jobs are found
  it("should return 404 when no jobs are found", async () => {
    cacheQueryJob.mockResolvedValue([]);

    await fetchJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      dataLength: 0,
      msg: "No jobs found.",
      data: [],
    });
  });

  // Test 3: Handle errors properly
  it("should handle errors properly", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while fetching jobs",
      error: "Database error",
    });
  });
});

describe("fetchJobByIDHandler", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Fetch job by ID successfully
  it("should return job data when found", async () => {
    const mockJob = { _id: "123", title: "Software Engineer" };
    Job.findById.mockResolvedValue(mockJob);

    await fetchJobByIDHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: `Job fetched successfully with Id: 123"`,
      data: mockJob,
    });
  });

  // Test 2: Return 404 if job is not found
  it("should return 404 if job not found", async () => {
    Job.findById.mockResolvedValue(null);

    await fetchJobByIDHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "No job found by particular ID",
    });
  });

  // Test 3: Handle errors properly
  it("should return 500 if an error occurs", async () => {
    Job.findById.mockRejectedValue(new Error("Database error"));

    await fetchJobByIDHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while fetching this Job",
      error: "Database error",
    });
  });
});

describe("updateJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "job123" },
      user: { id: "user123" },
      body: { title: "Updated Job Title", location: "Updated Location" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Update a job successfully
  it("should update a job successfully", async () => {
    const updatedJob = { _id: "job123", ...req.body };
    Job.findByIdAndUpdate.mockResolvedValue(updatedJob);

    await updateJobHandler(req, res);

    expect(invalidateCache).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Job updated successfully",
      data: updatedJob,
    });
  });

  // Test 2: Return 400 if required fields are missing
  it("should return 404 if job is not found", async () => {
    Job.findByIdAndUpdate.mockResolvedValue(null);

    await updateJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Job not found" });
  });

  // Test 3: Handle errors properly
  it("should handle errors properly", async () => {
    Job.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

    await updateJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while updating the job",
      error: "Database error",
    });
  });
});

describe("deleteJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "job123" },
      user: { id: "user123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Delete a job successfully
  it("should delete a job successfully", async () => {
    Job.findByIdAndDelete.mockResolvedValue({ _id: "job123" });

    await deleteJobHandler(req, res);

    expect(invalidateCache).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Job deleted successfully",
    });
  });

  // Test 2: Return 404 if job is not found
  it("should return 404 if job is not found", async () => {
    Job.findByIdAndDelete.mockResolvedValue(null);

    await deleteJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Job not found!",
    });
  });

  // Test 3: Handle errors properly
  it("should handle errors properly", async () => {
    Job.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    await deleteJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while deleting the job",
      error: "Database error",
    });
  });
});

describe("fetchPostedJobsHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: "user123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Fetch posted jobs successfully
  it("should fetch posted jobs successfully", async () => {
    const mockJobs = [
      { _id: "job1", title: "Job 1", postedBy: "user123" },
      { _id: "job2", title: "Job 2", postedBy: "user123" },
    ];
    cacheQueryJob.mockResolvedValue(mockJobs);

    await fetchPostedJobsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      length: mockJobs.length,
      msg: "Posted jobs fetched successfully",
      data: mockJobs,
    });
  });

  // Test 2: Return 404 if no jobs are found
  it("should return 404 if no jobs are found", async () => {
    cacheQueryJob.mockResolvedValue([]);

    await fetchPostedJobsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "No jobs found for this employer",
    });
  });

  // Test 3: Handle errors properly
  it("should handle errors properly", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchPostedJobsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while fetching the posted jobs",
      error: "Database error",
    });
  });
});
