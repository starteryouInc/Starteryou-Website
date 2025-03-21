const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const Application = require("../models/JobApplications");
const {
  applyJobHandler,
  fetchAppliedJobHandler,
  fetchAppliedUsersHandler,
  updateAppliedJobStatusHandler,
} = require("../handlers/JobApplicationHandlers");

jest.mock("../models/JobApplications");
jest.mock("../cache/utils/invalidateCache");
jest.mock("../cache/utils/cacheQueryJob");
jest.mock("../db", () => ({}));

/**
 * Tests for the `applyJobHandler` function.
 * - Ensures that job applications are submitted correctly.
 * - Validates required fields and returns appropriate errors.
 * - Prevents duplicate applications.
 * - Handles errors gracefully.
 */
describe("applyJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      params: { jobId: "job456" },
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        whyHire: "I am a great fit for this role.",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should return 400 if required fields are missing
  it("should return 400 if required fields are missing", async () => {
    req.body = {}; // Missing required fields

    await applyJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Required fields (firstName, lastName, email) are missing!",
    });
  });

  // Test 2: It should return 400 if the user has already applied
  it("should return 400 if the user has already applied", async () => {
    Application.findOne.mockResolvedValue({
      userId: "user123",
      jobId: "job456",
    });

    await applyJobHandler(req, res);

    expect(Application.findOne).toHaveBeenCalledWith({
      userId: "user123",
      jobId: "job456",
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "You have already applied to this Job",
    });
  });

  // Test 3: It should submit a job application successfully
  it("should submit a job application successfully", async () => {
    Application.findOne.mockResolvedValue(null); // No existing application
    Application.prototype.save = jest.fn().mockResolvedValue({
      userId: "user123",
      jobId: "job456",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      whyHire: "I am a great fit for this role.",
    });

    await applyJobHandler(req, res);

    expect(Application.findOne).toHaveBeenCalledWith({
      userId: "user123",
      jobId: "job456",
    });
    expect(Application.prototype.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/applications/fetch-applied-jobs/user123"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Application submitted successfully",
    });
  });

  // Test 4: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    Application.findOne.mockRejectedValue(new Error("Database error"));

    await applyJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while submitting the application",
      error: "Database error",
    });
  });
});

/**
 * Tests for the `fetchAppliedJobHandler` function.
 * - Fetches applied jobs successfully.
 * - Returns 404 if no applied jobs are found.
 * - Handles errors properly.
 */
describe("fetchAppliedJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should return 404 if no applied jobs are found
  it("should return 404 if no applied jobs are found", async () => {
    cacheQueryJob.mockResolvedValue([]);

    await fetchAppliedJobHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledWith(
      `/api/v1/jobportal/applications/fetch-applied-jobs/user123`,
      expect.any(Function),
      expect.anything()
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "No jobs found for this employer",
    });
  });

  // Test 2: It should return 200 and the list of applied jobs
  it("should return 200 and the list of applied jobs", async () => {
    const mockApplications = [
      { jobId: "job1", userId: "user123", email: "john@example.com" },
      { jobId: "job2", userId: "user123", email: "john@example.com" },
    ];

    cacheQueryJob.mockResolvedValue(mockApplications);

    await fetchAppliedJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      applications: mockApplications,
    });
  });

  // Test 3: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchAppliedJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some occured while fetching the applications",
      error: "Database error",
    });
  });
});

/**
 * Tests for the `fetchAppliedJobHandler` function.
 * - Fetches applied jobs successfully.
 * - Returns 404 if no applied jobs are found.
 * - Handles errors properly.
 */
describe("fetchAppliedUsers", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "employer123" },
      params: { jobId: "job456" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should return 404 if no users have applied
  it("should return 404 if no users have applied", async () => {
    cacheQueryJob.mockResolvedValue([]);

    await fetchAppliedUsersHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledWith(
      `/api/v1/jobportal/applications/fetch-applied-users/employer123`,
      expect.any(Function),
      expect.anything()
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "No jobs found for this employer",
    });
  });

  // Test 2: It should return 200 and the list of users who applied
  it("should return 200 and the list of users who applied", async () => {
    const mockApplicants = [
      { userId: "user1", jobId: "job456", email: "user1@example.com" },
      { userId: "user2", jobId: "job456", email: "user2@example.com" },
    ];

    cacheQueryJob.mockResolvedValue(mockApplicants);

    await fetchAppliedUsersHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Fetched all user who have applied to this job",
      applied: mockApplicants,
    });
  });

  // Test 3: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchAppliedUsersHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while fetching the users",
      error: "Database error",
    });
  });
});

/**
 * Tests for the `updateAppliedJobStatusHandler` function.
 * - Updates the status of an applied job successfully.
 * - Returns 400 if an invalid status is provided.
 * - Returns 404 if the application is not found.
 * - Handles errors properly.
 */
describe("updateAppliedJobStatusHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { applicationId: "app123" },
      body: { status: "shortlisted" },
      user: { id: "employer123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should return 400 for an invalid status
  it("should return 400 for an invalid status", async () => {
    req.body.status = "invalid_status";

    await updateAppliedJobStatusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Invalid status. Please provide one of the following: applied, shortlisted, rejected",
    });
  });

  // Test 2: It should return 404 if application is not found
  it("should return 404 if application is not found", async () => {
    Application.findById.mockResolvedValue(null);

    await updateAppliedJobStatusHandler(req, res);

    expect(Application.findById).toHaveBeenCalledWith("app123");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Application not found!" });
  });

  // Test 3: It should update application status and return 200
  it("should update application status and return 200", async () => {
    const mockApplication = {
      _id: "app123",
      status: "applied",
      save: jest.fn(),
    };
    Application.findById.mockResolvedValue(mockApplication);
    // invalidateCache.mockResolvedValue();

    await updateAppliedJobStatusHandler(req, res);

    expect(mockApplication.status).toBe("shortlisted");
    expect(mockApplication.save).toHaveBeenCalled();
    // expect(invalidateCache).toHaveBeenCalledWith(
    //   "/api/v1/jobportal/applications/fetch-applied-jobs/employer123"
    // );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Application status updated successfully.",
      //   application: mockApplication,
    });
  });

  // Test 4: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    Application.findById.mockRejectedValue(new Error("Database error"));

    await updateAppliedJobStatusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while updating the application status.",
      error: "Database error",
    });
  });
});
