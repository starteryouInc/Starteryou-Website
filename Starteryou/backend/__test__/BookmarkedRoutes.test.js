const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const BookmarkedJob = require("../models/BookmarkedJobs");
const {
  bookmarkedJobHandler,
  deleteBookmarkHandler,
  fetchBookmarkJobsHandler,
} = require("../handlers/BookmarkHandlers");

jest.mock("../models/BookmarkedJobs");
jest.mock("../cache/utils/cacheQueryJob");
jest.mock("../cache/utils/invalidateCache");
jest.mock("../db", () => ({}));

/**
 * Tests for the `bookmarkedJobHandler` function.
 * - Ensures a job can be bookmarked successfully.
 * - Prevents duplicate bookmarks.
 * - Handles errors gracefully.
 */
describe("bookmarkedJobHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      params: { jobId: "job456" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: It should bookmark a job successfully
  it("should bookmark a job successfully", async () => {
    BookmarkedJob.findOne.mockResolvedValue(null);
    BookmarkedJob.prototype.save.mockResolvedValue({
      userId: "user123",
      jobId: "job456",
    });

    await bookmarkedJobHandler(req, res);

    expect(invalidateCache).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Job bookmarked successfully",
    });
  });

  // Test 2: It should return 400 if job is already bookmarked
  it("should return 400 if job is already bookmarked", async () => {
    BookmarkedJob.findOne.mockResolvedValue({
      userId: "user123",
      jobId: "job456",
    });

    await bookmarkedJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Already Bookmarked" });
  });

  // Test 3: It should handle errors properly
  it("should handle errors properly", async () => {
    BookmarkedJob.findOne.mockRejectedValue(new Error("Database error"));

    await bookmarkedJobHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while bookmarking the job",
      error: "Database error",
    });
  });
});

/**
 * Tests for the `deleteBookmarkHandler` function.
 * - Ensures a bookmarked job can be removed.
 * - Handles errors properly.
 */
describe("deleteBookmarkHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      params: { jobId: "job456" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: It should delete a bookmark successfully
  it("should delete a bookmark successfully", async () => {
    BookmarkedJob.findOneAndDelete.mockResolvedValue({
      userId: "user123",
      jobId: "job456",
    });

    await deleteBookmarkHandler(req, res);

    expect(invalidateCache).toHaveBeenCalledTimes(1);
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/user123"
    );

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Job unsaved successfully",
    });
  });

  // Test 2: It should handle errors properly
  it("should handle errors properly", async () => {
    BookmarkedJob.findOneAndDelete.mockRejectedValue(
      new Error("Database error")
    );

    await deleteBookmarkHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while unsaving the job",
      error: "Database error",
    });

    expect(invalidateCache).not.toHaveBeenCalled();
  });
});

/**
 * Tests for the `fetchBookmarkJobsHandler` function.
 * - Fetches bookmarked jobs successfully.
 * - Handles cases where no bookmarks exist.
 * - Ensures error handling works correctly.
 */
describe("fetchBookmarkJobsHandler", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: It should fetch bookmarked jobs successfully
  it("should fetch bookmarked jobs successfully", async () => {
    const mockBookmarks = [
      { jobId: "job123", userId: "user123" },
      { jobId: "job456", userId: "user123" },
    ];

    cacheQueryJob.mockResolvedValue(mockBookmarks);

    await fetchBookmarkJobsHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledTimes(1);
    expect(cacheQueryJob).toHaveBeenCalledWith(
      "/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs/user123",
      expect.any(Function),
      expect.anything()
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      bookmarked: mockBookmarks,
    });
  });

  // Test 2: It should return 404 when no bookmarked jobs are found
  it("should return 404 when no bookmarked jobs are found", async () => {
    cacheQueryJob.mockResolvedValue([]);

    await fetchBookmarkJobsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "No jobs found for this employer",
    });
  });

  // Test 3: It should handle errors properly
  it("should handle errors properly", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchBookmarkJobsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while fetching the bookmarked jobs",
      error: "Database error",
    });
  });
});
