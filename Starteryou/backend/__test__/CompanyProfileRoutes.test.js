const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const CompanyProfile = require("../models/CompanyProfile");
const {
  createCompanyProfileHandler,
  fetchCompanyProfileHandler,
} = require("../handlers/CompanyProfileHandlers");

jest.mock("../models/CompanyProfile");
jest.mock("../cache/utils/cacheQueryJob");
jest.mock("../db", () => ({}));

describe("createCompanyProfileHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        employerRegistrationId: "employer123",
        companyName: "Tech Corp",
        companyWebsite: "https://techcorp.com",
        industry: "Technology",
        companySize: "100-500",
        companyType: "Private",
        location: "New York",
        foundedDate: "2010-05-15",
        tagline: "Innovating the Future",
        about: "Tech Corp is a leading technology company.",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a company profile successfully", async () => {
    const mockCompanyProfile = { ...req.body, _id: "company123" };

    CompanyProfile.prototype.save.mockResolvedValue(mockCompanyProfile);

    await createCompanyProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Company profile has been created successfully nothing changes",
      data: mockCompanyProfile,
    });
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { companyName: "Tech Corp" }; // Missing employerRegistrationId

    await createCompanyProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Required fields (employerRegistrationId, companyName) are missing",
    });
  });

  it("should handle errors properly", async () => {
    CompanyProfile.prototype.save.mockRejectedValue(
      new Error("Database error")
    );

    await createCompanyProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while creating the company profile",
      error: "Database error",
    });
  });
});

describe("fetchCompanyProfileHandler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: "employer123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should fetch a company profile successfully", async () => {
    const mockCompanyProfile = {
      employerRegistrationId: "employer123",
      companyName: "Tech Corp",
      industry: "Technology",
    };

    cacheQueryJob.mockResolvedValue(mockCompanyProfile);

    await fetchCompanyProfileHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledWith(
      `/api/get-company-profile/employer123`,
      expect.any(Function),
      expect.any(Number)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Company profile found successfully",
      data: mockCompanyProfile,
    });
  });

  it("should return 404 if company profile is not found", async () => {
    cacheQueryJob.mockResolvedValue(null);

    await fetchCompanyProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Company profile not found!",
    });
  });

  it("should handle errors properly", async () => {
    cacheQueryJob.mockRejectedValue(new Error("Database error"));

    await fetchCompanyProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while fetching the company profile",
      error: "Database error",
    });
  });
});
