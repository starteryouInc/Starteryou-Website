// config/api.js
export const API_CONFIG = {
  baseURL: "http://localhost:3000",
  endpoints: {
    fileByTitle: (title) => `/api/files/download/${title}`,
    fileUpload: "/api/files/upload",
    fileDownload: (title) => `/api/files/download/${title}`,
    fileUpdate: (title) => `/api/files/update/${title}`,
    fileDelete: (title) => `/api/files/delete/${title}`,
    fileList: "/api/files/list",
    fileCleanup: "/api/files/cleanup",
    textApi: "/api/text",
    teamApi: "/api/team",
    authLogin: "/api/v1/auth/login",
    authRegister: "/api/v1/auth/register",
    newsletterApi: "/api/newsletter/subscribe",

    // Register and Login API's
    userEmpRegister: "/api/v1/userAuth/users-emp-register",
    userSeekerRegister: "/api/v1/userAuth/users-seeker-register",
    userLogin: "/api/v1/userAuth/users-login",
    // Job API's
    createJob: "/api/v1/jobportal/jobs/create-job",
    getJobs: "/api/v1/jobportal/jobs/fetch-job",
    getJobById: (id) => `/api/v1/jobportal/jobs/fetch-job/${id}`,
    updateJob: (id) => `/api/v1/jobportal/jobs/update-job/${id}`,
    deleteJob: (id) => `/api/v1/jobportal/jobs/delete-job/${id}`,
    getPostedJobs: (userId) => `/api/v1/jobportal/jobs/fetch-posted-jobs/${userId}`,
    // Job Application API's
    applyJob: (jobId) => `/api/v1/jobportal/applications/${jobId}/apply-job`,
    getAppliedJobs: "/api/v1/jobportal/applications/fetch-applied-jobs",
    changeJobStatus: (applicationId) =>
      `/api/v1/jobportal/applications/change-job-status/${applicationId}`,
    // Bookmark Job API's
    bookmarkJob: (jobId) =>
      `/api/v1/jobportal/bookmarks/${jobId}/bookmarked-job`,
    unbookmarkJob: (jobId) =>
      `/api/v1/jobportal/bookmarks/${jobId}/unbookmark-job`,
    getBookmarkedJobs: "/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs",
    // User Profile API's
    createUserProfile: "/api/v1/jobportal/profile/create-profile",
    getUserProfile: (userId) =>
      `/api/v1/jobportal/profile/fetch-profile/${userId}`,
    updateUserProfile: (userId) =>
      `/api/v1/jobportal/profile/update-profile/${userId}`,

    // Fetch user profile fields:
    getUserProfileField: (userId) =>
      `/api/v1/jobportal/profile/get-profile-fields/${userId}`,

    // Work Experience:
    addWorkExperience: (userId) =>
      `/api/v1/jobportal/profile/add-workExperience/${userId}`,
    updateWorkExperience: (userId, subDocId) =>
      `/api/v1/jobportal/profile/update-workExperience/${userId}/${subDocId}`,
    deleteWorkExperience: (userId, subDocId) =>
      `/api/v1/jobportal/profile/delete-workExperience/${userId}/${subDocId}`,

    // Education Details:
    addEducation: (userId) =>
      `/api/v1/jobportal/profile/add-educationDetails/${userId}`,
    updateEducation: (userId, subDocId) =>
      `/api/v1/jobportal/profile/update-educationDetails/${userId}/${subDocId}`,
    deleteEducation: (userId, subDocId) =>
      `/api/v1/jobportal/profile/delete-educationDetails/${userId}/${subDocId}`,

    // Skills:
    addSkill: (userId) => `/api/v1/jobportal/profile/add-skills/${userId}`,
    deleteSkill: (userId) =>
      `/api/v1/jobportal/profile/delete-skills/${userId}`,

    // Certifications:
    addCertificate: (userId) =>
      `/api/v1/jobportal/profile/add-certifications/${userId}`,
    updateCertificate: (userId, subDocId) =>
      `/api/v1/jobportal/profile/update-certifications/${userId}/${subDocId}`,
    deleteCertificate: (userId, subDocId) =>
      `/api/v1/jobportal/profile/delete-certifications/${userId}/${subDocId}`,

    // Projects:
    addProject: (userId) => `/api/v1/jobportal/profile/add-projects/${userId}`,
    updateProject: (userId, subDocId) =>
      `/api/v1/jobportal/profile/update-projects/${userId}/${subDocId}`,
    deleteProject: (userId, subDocId) =>
      `/api/v1/jobportal/profile/delete-projects/${userId}/${subDocId}`,

    // Languages:
    addLanguage: (userId) =>
      `/api/v1/jobportal/profile/add-languages/${userId}`,
    deleteLanguage: (userId) =>
      `/api/v1/jobportal/profile/delete-languages/${userId}`,

    // Company profile:
    createCompanyProfile: `/api/v1/jobportal/companyProfile/create-company-profile`,
    getCompanyProfile: (userId) =>
      `/api/v1/jobportal/companyProfile/get-company-profile/${userId}`,
  },
};
