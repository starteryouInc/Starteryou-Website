const cacheQuery = require("../cache/utils/cacheQuery");
const TextContent = require("../models/TextContent");
const { fetchTextContent } = require("../handlers/TextHandlers");

jest.mock("mongoose");
jest.mock("../cache/utils/cacheQuery");
jest.mock("../models/TextContent", () => ({
  find: jest.fn().mockReturnValue({
    maxTimeMS: jest.fn().mockReturnThis(),
    lean: jest.fn(),
  }),
}));

jest.mock("../cache/utils/invalidateCache");
jest.mock("../db", () => ({}));

describe("fetchTextContent", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the chainable functions .maxTimeMS() and .lean()
    TextContent.find = jest.fn().mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    });

    TextContent.findOne = jest.fn().mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    });

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should return 400 if 'page' is not provided in query parameters", async () => {
    await fetchTextContent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "'page' is required in query parameters.",
    });
  });

  it("should return content from cache if available", async () => {
    req.query.page = "home";
    const cachedContent = [{ page: "home", content: "Some content" }];
    cacheQuery.mockResolvedValue(cachedContent);

    await fetchTextContent(req, res);

    expect(cacheQuery).toHaveBeenCalledWith(
      "/api/text?page=home",
      expect.any(Function),
      expect.anything()
    );
    expect(res.json).toHaveBeenCalledWith(cachedContent);
  });

  it("should query the database if cache misses", async () => {
    req.query.page = "home";
    const dbContent = [{ page: "home", content: "Some content" }];
    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn();
    });

    TextContent.find.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(dbContent),
    });

    await fetchTextContent(req, res);

    expect(TextContent.find).toHaveBeenCalledWith({ page: "home" });
    expect(res.json).toHaveBeenCalledWith(dbContent);
  });

  it("should return 404 if no content is found in cache or database", async () => {
    req.query.page = "home";
    cacheQuery.mockResolvedValue(null);

    await fetchTextContent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Content not found in cache or database.",
    });
  });

  it("should throw 500 if there is an error during the query", async () => {
    req.query.page = "home";
    cacheQuery.mockImplementation(async () => {
      throw new Error("Database error");
    });

    await fetchTextContent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while retrieving content.",
      error: "Database error",
    });
  });

  it("should query for a specific component if provided", async () => {
    req.query.page = "home";
    req.query.component = "header";
    const dbContent = {
      page: "home",
      component: "header",
      content: "Header content",
    };
    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn();
    });

    TextContent.findOne.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(dbContent),
    });

    await fetchTextContent(req, res);

    expect(TextContent.findOne).toHaveBeenCalledWith({
      page: "home",
      component: "header",
    });
    expect(res.json).toHaveBeenCalledWith(dbContent);
  });

  it("should return 404 if component-specific content is not found", async () => {
    req.query.page = "home";
    req.query.component = "header";

    cacheQuery.mockImplementation(async (cacheKey, queryFn) => {
      return await queryFn();
    });

    TextContent.findOne.mockReturnValue({
      maxTimeMS: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null), // Return null to simulate not found
    });

    await fetchTextContent(req, res);

    expect(res.status).toHaveBeenCalledWith(404); // Expect 404 for not found
    expect(res.json).toHaveBeenCalledWith({
      message: "Content not found in cache or database.",
    });
  });
});
