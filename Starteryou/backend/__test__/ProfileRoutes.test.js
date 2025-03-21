const cacheQueryJob = require("../cache/utils/cacheQueryJob");
const { invalidateCache } = require("../cache/utils/invalidateCache");
const UserProfile = require("../models/UserProfile");
const {
  createProfileHandler,
  fetchProfileHandler,
  updateProfileHandler,
  fetchProfileFieldsHandler,
} = require("../handlers/ProfileHandlers");
const {
  addSubdocument,
  updateSubdocument,
  deleteSubdocument,
  addStringToArray,
  deleteStringFromArray,
} = require("../services/userProfileService");

jest.mock("../models/UserProfile");
jest.mock("../cache/utils/cacheQueryJob");
jest.mock("../cache/utils/invalidateCache");
jest.mock("../db", () => ({}));

/**
 * Test suite for createProfileHandler
 *
 * - Ensures successful profile creation.
 * - Validates missing required fields.
 * - Handles errors properly.
 */
describe("createProfileHandler", () => {
  let req, res, mockProfile;

  beforeEach(() => {
    req = {
      body: {
        userRegistrationId: "user123",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNo: "1234567890",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockProfile = {
      userRegistrationId: "user123",
      name: "John Doe",
      email: "johndoe@example.com",
      phoneNo: "1234567890",
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should create a profile and return 201
  it("should create a profile and return 201", async () => {
    UserProfile.mockImplementation(() => mockProfile);

    await createProfileHandler(req, res);

    expect(UserProfile).toHaveBeenCalledWith({
      userRegistrationId: "user123",
      name: "John Doe",
      email: "johndoe@example.com",
      phoneNo: "1234567890",
    });
    expect(mockProfile.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "New Profile has been created successfully",
      //   data: mockProfile,
    });
  });

  // Test 2: It should return 400 if required fields are missing
  it("should return 400 if required fields are missing", async () => {
    req.body = { name: "John Doe", email: "johndoe@example.com" }; // Missing userRegistrationId

    await createProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Required fields (userRegistrationId, name, email) are missing",
    });
  });

  // Test 3: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    UserProfile.mockImplementation(() => {
      throw new Error("Database error");
    });

    await createProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while creating the new Profile",
      error: expect.any(Error),
    });
  });
});

/**
 * Test suite for fetchProfileHandler
 *
 * - Fetches cached profile if available.
 * - Retrieves fresh data if cache is empty.
 * - Returns 404 if profile is not found.
 * - Handles errors properly.
 */
describe("fetchProfileHandler", () => {
  let req, res, mockProfile, cacheKey;

  beforeEach(() => {
    req = { params: { userId: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    cacheKey = `/fetch-profile/user123`;

    mockProfile = [
      {
        userRegistrationId: "user123",
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNo: "1234567890",
      },
    ];

    jest.clearAllMocks();
  });

  // Test 1: It should return cached profile if available
  it("should return cached profile if available", async () => {
    cacheQueryJob.mockResolvedValue(mockProfile);

    await fetchProfileHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledWith(cacheKey);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dataLength: mockProfile.length,
      msg: "Profiles fetched successfully",
      data: mockProfile,
    });
  });

  // Test 2: It should fetch fresh profile data if cache is empty and return 200
  it("should fetch fresh profile data if cache is empty and return 200", async () => {
    cacheQueryJob.mockResolvedValue(null);
    UserProfile.find.mockResolvedValue(mockProfile);

    await fetchProfileHandler(req, res);

    expect(UserProfile.find).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(cacheQueryJob).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Number)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dataLength: mockProfile.length,
      msg: "Profiles fetched successfully",
      data: mockProfile,
    });
  });

  // Test 3: It should return 404 if profile is not found
  it("should return 404 if profile is not found", async () => {
    cacheQueryJob.mockResolvedValue(null);
    UserProfile.find.mockResolvedValue([]);

    await fetchProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "No profile found!",
    });
  });

  // Test 4: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    cacheQueryJob.mockImplementation(() => {
      throw new Error("Cache error");
    });

    await fetchProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while fetching the Profiles",
      error: "Cache error",
    });
  });
});

/**
 * Test suite for updateProfileHandler
 *
 * - Ensures profile is updated successfully.
 * - Validates missing profile scenario.
 * - Handles errors properly.
 */
describe("updateProfileHandler", () => {
  let req, res, mockUpdatedProfile, cacheKey;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123" },
      body: {
        professionalTitle: "Software Engineer",
        location: "New York",
        currentCompany: "TechCorp",
        totalExperience: "5 years",
        phoneNo: "1234567890",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    cacheKey = `/fetch-profile/user123`;

    mockUpdatedProfile = {
      userRegistrationId: "user123",
      professionalTitle: "Software Engineer",
      location: "New York",
      currentCompany: "TechCorp",
      totalExperience: "5 years",
      phoneNo: "1234567890",
    };

    jest.clearAllMocks();
  });

  // Test 1: It should update the profile and return 200
  it("should update the profile and return 200", async () => {
    UserProfile.findOneAndUpdate.mockResolvedValue(mockUpdatedProfile);

    await updateProfileHandler(req, res);

    expect(UserProfile.findOneAndUpdate).toHaveBeenCalledWith(
      { userRegistrationId: "user123" },
      {
        professionalTitle: "Software Engineer",
        location: "New York",
        currentCompany: "TechCorp",
        totalExperience: "5 years",
        phoneNo: "1234567890",
      },
      { new: true, lean: true }
    );
    expect(invalidateCache).toHaveBeenCalledWith(cacheKey);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "Profile updated successfully",
      data: mockUpdatedProfile,
    });
  });

  // Test 2: It should return 400 if user profile not found
  it("should return 404 if profile not found", async () => {
    UserProfile.findOneAndUpdate.mockResolvedValue(null);

    await updateProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "User Profile not found!",
    });
  });

  // Test 3: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    UserProfile.findOneAndUpdate.mockImplementation(() => {
      throw new Error("Database error");
    });

    await updateProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while updating the profile",
      error: "Database error",
    });
  });
});

/**
 * Test suite for fetchProfileFieldsHandler
 *
 * - Validates required field parameter.
 * - Ensures valid/invalid field scenarios.
 * - Fetches profile fields from cache or database.
 * - Handles missing profile or errors properly.
 */
describe("fetchProfileFieldsHandler", () => {
  let req, res, cacheKey, mockUserData;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123" },
      query: { field: "skills" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    cacheKey = `/api/v1/jobportal/profile/get-profile-fields/user123?field=skills`;

    mockUserData = { skills: ["JavaScript", "React", "Node.js"] };

    jest.clearAllMocks();
  });

  // Test 1: It should return 400 if field parameter is missing
  it("should return 400 if field parameter is missing", async () => {
    req.query.field = undefined;

    await fetchProfileFieldsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Field parameter is required!",
    });
  });

  // Test 2: It should return 400 if an invalid field is requested
  it("should return 400 if an invalid field is requested", async () => {
    req.query.field = "invalidField";

    await fetchProfileFieldsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Invalid field requested!",
    });
  });

  // Test 3: It should fetch the profile field from cache if available
  it("should fetch the profile field from cache if available", async () => {
    cacheQueryJob.mockResolvedValue(mockUserData.skills);

    await fetchProfileFieldsHandler(req, res);

    expect(cacheQueryJob).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Number)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "skills fetched successfully",
      data: mockUserData.skills,
    });
  });

  // Test 4: It should fetch the profile field from the database if cache is empty
  it("should fetch the profile field from the database if cache is empty", async () => {
    cacheQueryJob.mockImplementation(async (key, fetchFunction) =>
      fetchFunction()
    );

    UserProfile.findOne.mockResolvedValue(mockUserData);

    await fetchProfileFieldsHandler(req, res);

    expect(UserProfile.findOne).toHaveBeenCalledWith(
      { userRegistrationId: "user123" },
      { skills: 1, _id: 0 }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "skills fetched successfully",
      data: mockUserData.skills,
    });
  });

  // Test 5: It should return 404 if user not found
  it("should return 404 if user not found", async () => {
    cacheQueryJob.mockImplementation(async (key, fetchFunction) =>
      fetchFunction()
    );

    UserProfile.findOne.mockResolvedValue(null);

    await fetchProfileFieldsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 6: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    cacheQueryJob.mockImplementation(async () => {
      throw new Error("Database error");
    });

    await fetchProfileFieldsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occured while fetching the skills",
      error: expect.any(Error),
    });
  });
});

/**
 * Adds a subdocument to a user's profile.
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The field to which the subdocument belongs.
 * @param {Object} data - The subdocument data to be added.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
describe("addSubdocument", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123" },
      body: { field: "skills", data: { name: "JavaScript", level: "Expert" } },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should add a subdocument and return 201
  it("should add a subdocument and return 201", async () => {
    const mockUser = {
      userRegistrationId: "user123",
      skills: [{ name: "Python", level: "Intermediate" }],
      save: jest.fn().mockResolvedValue(true),
    };

    UserProfile.findOne.mockResolvedValue(mockUser);

    await addSubdocument(
      req.params.userRegistrationId,
      req.body.field,
      req.body.data,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(mockUser.skills.length).toBe(2);
    expect(mockUser.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/profile/get-profile-fields/user123?field=skills"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dataLength: 2,
      msg: "skills added successfully",
      data: mockUser.skills,
    });
  });

  // Test 2: It should return 404 if user is not found
  it("should return 404 if user is not found", async () => {
    UserProfile.findOne.mockResolvedValue(null);

    await addSubdocument(
      req.params.userRegistrationId,
      req.body.field,
      req.body.data,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 3: It should return 500 on error
  it("should return 500 on error", async () => {
    UserProfile.findOne.mockRejectedValue(new Error("Database error"));

    await addSubdocument(
      req.params.userRegistrationId,
      req.body.field,
      req.body.data,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while adding the skills",
      error: expect.any(Error),
    });
  });
});

/**
 * Updates a subdocument within a user's profile.
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} subDocId - The ID of the subdocument to update.
 * @param {string} field - The field to which the subdocument belongs.
 * @param {Object} updates - The updates to be applied to the subdocument.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
describe("updateSubdocument", () => {
  let req, res, mockUser, mockSubDoc;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123", subDocId: "subdoc456" },
      body: { field: "skills", updates: { level: "Advanced" } },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockSubDoc = {
      _id: "subdoc456",
      name: "JavaScript",
      level: "Intermediate",
    };
    mockUser = {
      userRegistrationId: "user123",
      skills: [{ ...mockSubDoc }],
      save: jest.fn().mockResolvedValue(true),
    };

    mockUser.skills.id = jest.fn((id) =>
      id === "subdoc456" ? mockSubDoc : null
    );

    jest.clearAllMocks();
  });

  // Test 1: It should update a subdocument and return 200
  it("should update a subdocument and return 200", async () => {
    UserProfile.findOne.mockResolvedValue(mockUser);

    await updateSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      req.body.updates,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(mockUser.skills.id).toHaveBeenCalledWith("subdoc456");
    expect(mockSubDoc.level).toBe("Advanced");
    expect(mockUser.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/profile/get-profile-fields/user123?field=skills"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "skills updated successfully",
      data: mockSubDoc,
    });
  });

  // Test 2: It should return 404 if user is not found
  it("should return 404 if user is not found", async () => {
    UserProfile.findOne.mockResolvedValue(null);

    await updateSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      req.body.updates,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 3: It should return 404 if subdocument is not found
  it("should return 404 if subdocument is not found", async () => {
    mockUser.skills.id.mockReturnValue(null);
    UserProfile.findOne.mockResolvedValue(mockUser);

    await updateSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      req.body.updates,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Subdocument not found!" });
  });

  // Test 4: It should return 500 on error
  it("should return 500 on error", async () => {
    UserProfile.findOne.mockRejectedValue(new Error("Database error"));

    await updateSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      req.body.updates,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while updating the skills",
      error: expect.any(Error),
    });
  });
});

/**
 * Deletes a subdocument from a user's profile.
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} subDocId - The ID of the subdocument to delete.
 * @param {string} field - The field to which the subdocument belongs.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
describe("deleteSubdocument", () => {
  let req, res, mockUser, mockSubDoc;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123", subDocId: "subdoc456" },
      body: { field: "skills" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockSubDoc = { _id: "subdoc456", name: "JavaScript", remove: jest.fn() };
    mockUser = {
      userRegistrationId: "user123",
      skills: [{ ...mockSubDoc }],
      save: jest.fn().mockResolvedValue(true),
    };

    mockUser.skills.id = jest.fn((id) =>
      id === "subdoc456" ? mockSubDoc : null
    );

    jest.clearAllMocks();
  });

  // Test 1: It should delete a subdocument and return 200
  it("should delete a subdocument and return 200", async () => {
    UserProfile.findOne.mockResolvedValue(mockUser);

    await deleteSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(mockUser.skills.id).toHaveBeenCalledWith("subdoc456");
    expect(mockSubDoc.remove).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/profile/get-profile-fields/user123?field=skills"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "skills deleted successfully",
      data: mockSubDoc,
    });
  });

  // Test 2: It should return 404 if user is not found
  it("should return 404 if user is not found", async () => {
    UserProfile.findOne.mockResolvedValue(null);

    await deleteSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 3: It should return 404 if subdocument is not found
  it("should return 404 if subdocument is not found", async () => {
    mockUser.skills.id.mockReturnValue(null);
    UserProfile.findOne.mockResolvedValue(mockUser);

    await deleteSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Subdocument not found!" });
  });

  // Test 4: It should return 500 on error
  it("should return 500 on error", async () => {
    UserProfile.findOne.mockRejectedValue(new Error("Database error"));

    await deleteSubdocument(
      req.params.userRegistrationId,
      req.params.subDocId,
      req.body.field,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while deleting the skills",
      error: expect.any(Error),
    });
  });
});

/**
 * Adds a string to an array field in the user's profile.
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The field name where the string will be added.
 * @param {string} value - The string value to add to the array.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
describe("addStringToArray", () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123" },
      body: { field: "skills", value: "JavaScript" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      userRegistrationId: "user123",
      skills: ["React"],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should add a string to the array and return 201
  it("should add a string to the array and return 201", async () => {
    UserProfile.findOne.mockResolvedValue(mockUser);

    await addStringToArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(mockUser.skills).toContain("JavaScript");
    expect(mockUser.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/profile/get-profile-fields/user123?field=skills"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      dataLength: 2,
      msg: "skills item added successfully",
      data: mockUser.skills,
    });
  });

  // Test 2: It should return 400 if value is empty or not a string
  it("should return 400 if value is empty or not a string", async () => {
    await addStringToArray(
      req.params.userRegistrationId,
      req.body.field,
      "",
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Invalid value for skills. Must be a non-empty string.",
    });
  });

  // Test 3: It should return 404 if user is not found
  it("should return 404 if user is not found", async () => {
    UserProfile.findOne.mockResolvedValue(null);

    await addStringToArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 4: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    UserProfile.findOne.mockRejectedValue(new Error("Database error"));

    await addStringToArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while adding to skills",
      error: expect.any(Error),
    });
  });
});

/**
 * Deletes a string from an array field in the user's profile.
 * @param {string} userRegistrationId - The ID of the user.
 * @param {string} field - The field name where the string will be removed.
 * @param {string} value - The string value to delete from the array.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
describe("deleteStringFromArray", () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      params: { userRegistrationId: "user123" },
      body: { field: "skills", value: "JavaScript" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      userRegistrationId: "user123",
      skills: ["JavaScript", "React"],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  // Test 1: It should delete a string from the array and return 200
  it("should delete a string from the array and return 200", async () => {
    UserProfile.findOne.mockResolvedValue(mockUser);

    await deleteStringFromArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(mockUser.skills).not.toContain("JavaScript");
    expect(mockUser.save).toHaveBeenCalled();
    expect(invalidateCache).toHaveBeenCalledWith(
      "/api/v1/jobportal/profile/get-profile-fields/user123?field=skills"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      msg: "JavaScript deleted successfully",
      data: "JavaScript",
    });
  });

  // Test 2: It should return 400 if value is empty or not a string
  it("should return 404 if the value is not found in the array", async () => {
    mockUser.skills = ["React", "Node.js"]; // JavaScript is not in the array
    UserProfile.findOne.mockResolvedValue(mockUser);

    await deleteStringFromArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "JavaScript not found in the skills",
    });
  });

  // Test 3: It should return 404 if user is not found
  it("should return 404 if the user is not found", async () => {
    UserProfile.findOne.mockResolvedValue(null);

    await deleteStringFromArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(UserProfile.findOne).toHaveBeenCalledWith({
      userRegistrationId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found!" });
  });

  // Test 4: It should return 500 if an error occurs
  it("should return 500 if an error occurs", async () => {
    UserProfile.findOne.mockRejectedValue(new Error("Database error"));

    await deleteStringFromArray(
      req.params.userRegistrationId,
      req.body.field,
      req.body.value,
      res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      msg: "Some error occurred while deleting the JavaScript",
      error: expect.any(Error),
    });
  });
});
