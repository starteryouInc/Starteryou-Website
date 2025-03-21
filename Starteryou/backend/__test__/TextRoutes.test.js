// Import required modules and mocks
const cacheQuery = require("../cache/utils/cacheQuery"); // Mocked cache utility
const TextContent = require("../models/TextContent"); // Mocked TextContent model
const { fetchTextContent } = require("../handlers/TextHandlers"); // Function being tested

// Mock Mongoose and other dependencies
jest.mock("mongoose");
jest.mock("../cache/utils/cacheQuery");
jest.mock("../models/TextContent", () => ({
  find: jest.fn().mockReturnValue({
    maxTimeMS: jest.fn().mockReturnThis(), // Chainable .maxTimeMS() method
    lean: jest.fn(), // Chainable .lean() method
  }),
}));
jest.mock("../cache/utils/invalidateCache");
jest.mock("../db", () => ({})); // Mock db module

/**
 * Test suite for the fetchTextContent function.
 */
describe("fetchTextContent", () => {
  let req, res; // Define request and response objects

  // Set up request/response mocks before each test case
  beforeEach(() => {
    req = { query: {} }; // Mock request with an empty query
    res = {
      status: jest.fn().mockReturnThis(), // Mock chainable status function
      json: jest.fn(), // Mock json function to return response
    };

    // Mock the chainable functions for TextContent.find and TextContent.findOne
    TextContent.find = jest.fn().mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    });

    TextContent.findOne = jest.fn().mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    });

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  /**
   * Test case: Should return 400 if 'page' query parameter is missing.
   * @returns {void}
   */
  it("should return 400 if 'page' is not provided in query parameters", async () => {
    await fetchTextContent(req, res); // Call the handler function
    expect(res.status).toHaveBeenCalledWith(400); // Check that 400 status was set
    expect(res.json).toHaveBeenCalledWith({
      message: "'page' is required in query parameters.",
    });
  });

  /**
   * Test case: Should return content from cache if available.
   * @returns {void}
   */
  it("should return content from cache if available", async () => {
    req.query.page = "home"; // Set query to include 'page'
    const cachedContent = [{ page: "home", content: "Some content" }]; // Mocked cache content
    cacheQuery.mockResolvedValue(cachedContent); // Simulate cache hit

    await fetchTextContent(req, res); // Call the handler

    expect(cacheQuery).toHaveBeenCalledWith(
      "/api/text?page=home", // Verify cache query key
      expect.any(Function),
      expect.anything()
    );
    expect(res.json).toHaveBeenCalledWith(cachedContent); // Check response with cached content
  });

  /**
   * Test case: Should query the database if cache misses.
   * @returns {void}
   */
  it("should query the database if cache misses", async () => {
    req.query.page = "home"; // Set query to include 'page'
    const dbContent = [{ page: "home", content: "Some content" }]; // Mocked database content
    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn(); // Simulate cache miss, so query function is called
    });

    TextContent.find.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(dbContent), // Mock resolved database result
    });

    await fetchTextContent(req, res); // Call the handler

    expect(TextContent.find).toHaveBeenCalledWith({ page: "home" }); // Verify DB query
    expect(res.json).toHaveBeenCalledWith(dbContent); // Check response with DB content
  });

  /**
   * Test case: Should return 404 if no content is found in cache or database.
   * @returns {void}
   */
  it("should return 404 if no content is found in cache or database", async () => {
    req.query.page = "home"; // Set query to include 'page'
    cacheQuery.mockResolvedValue(null); // Simulate cache miss and no DB content

    await fetchTextContent(req, res); // Call the handler

    expect(res.status).toHaveBeenCalledWith(404); // Check that 404 status was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Content not found in cache or database.",
    });
  });

  /**
   * Test case: Should return 500 if there is an error during the query.
   * @returns {void}
   */
  it("should throw 500 if there is an error during the query", async () => {
    req.query.page = "home"; // Set query to include 'page'
    cacheQuery.mockImplementation(async () => {
      throw new Error("Database error"); // Simulate DB error
    });

    await fetchTextContent(req, res); // Call the handler

    expect(res.status).toHaveBeenCalledWith(500); // Check that 500 status was set
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while retrieving content.",
      error: "Database error", // Check for error message in response
    });
  });

  /**
   * Test case: Should query for a specific component if provided.
   * @returns {void}
   */
  it("should query for a specific component if provided", async () => {
    req.query.page = "home"; // Set query to include 'page'
    req.query.component = "header"; // Set query to include 'component'
    const dbContent = {
      page: "home",
      component: "header",
      content: "Header content", // Mocked database content for specific component
    };
    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn(); // Simulate cache miss
    });

    TextContent.findOne.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(dbContent), // Mock resolved result
    });

    await fetchTextContent(req, res); // Call the handler

    expect(TextContent.findOne).toHaveBeenCalledWith({
      page: "home",
      component: "header", // Check query for specific component
    });
    expect(res.json).toHaveBeenCalledWith(dbContent); // Check response with component-specific content
  });

  /**
   * Test case: Should return 404 if component-specific content is not found.
   * @returns {void}
   */
  it("should return 404 if component-specific content is not found", async () => {
    req.query.page = "home"; // Set query to include 'page'
    req.query.component = "header"; // Set query to include 'component'

    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn(); // Simulate cache miss
    });

    TextContent.findOne.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null), // Simulate no result from DB
    });

    await fetchTextContent(req, res); // Call the handler

    expect(res.status).toHaveBeenCalledWith(404); // Check that 404 status was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Content not found in cache or database.",
    });
  });
});
