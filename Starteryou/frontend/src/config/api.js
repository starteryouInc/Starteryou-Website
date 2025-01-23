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
    authLogin: "/api/v1/auth/login",
    authRegister: "/api/v1/auth/register",

    // New API's
    createJob: "/api/v1/jobportal/jobs/create-job",
    getJobs: "/api/v1/jobportal/jobs/fetch-job",
    getJobById: (id) => `/api/v1/jobportal/jobs/fetch-job/${id}`,
    updateJob: (id) => `/api/v1/jobportal/jobs/update-job/${id}`,
    deleteJob: (id) => `/api/v1/jobportal/jobs/delete-job/${id}`,
    userRegister: "/api/v1/userAuth/users-register",
    userLogin: "/api/v1/userAuth/users-login",
    applyJob: (jobId) => `/api/v1/jobportal/applications/${jobId}/apply-job`,
    getAppliedJobs: (userId) => `/api/v1/jobportal/applications/fetch-applied-jobs/${userId}`,
    changeJobStatus: (applicationId) =>
      `/api/v1/jobportal/applications/change-job-status/${applicationId}`,
    bookmarkJob: (jobId) =>
      `/api/v1/jobportal/bookmarks/${jobId}/bookmarked-job`,
    getBookmarkedJobs: "/api/v1/jobportal/bookmarks/fetch-bookmarked-jobs",
  },
};
