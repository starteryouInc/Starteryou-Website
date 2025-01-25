// config/api.js
export const API_CONFIG = {
  baseURL: "http://localhost:3000",
  // baseURL: "http://dev.starteryou.com:3000",
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

    // New API's
    createJob: "/api/v1/jobportal/jobs/create-job",
    getJobs: "/api/v1/jobportal/jobs/fetch-job",
    getJobById: (id) => `/api/v1/jobportal/jobs/fetch-job/${id}`,
    updateJob: (id) => `/api/v1/jobportal/jobs/update-job/${id}`,
    deleteJob: (id) => `/api/v1/jobportal/jobs/delete-job/${id}`,
    userEmpRegister: "/api/v1/userAuth/users-emp-register",
    userSeekerRegister: "/api/v1/userAuth/users-seeker-register",
    userLogin: "/api/v1/userAuth/users-login",
    applyJob: (jobId) => `/api/v1/jobportal/applications/${jobId}/apply-job`,
    getAppliedJobs: "/api/v1/jobportal/applications/fetch-applied-jobs",
    changeJobStatus: (applicationId) =>
      `/api/v1/jobportal/applications/change-job-status/${applicationId}`,
    bookmarkJob: (jobId) =>
      `/api/v1/jobportal/bookmarks/${jobId}/bookmarked-job`,
    getBookmarkedJobs: "/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs",
    createUserProfile: "/api/v1/jobportal/profile/create-profile",
    getUserProfile: (userId) =>
      `/api/v1/jobportal/profile/fetch-profile/${userId}`,
  },
};
