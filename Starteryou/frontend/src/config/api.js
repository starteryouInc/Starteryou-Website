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
  },
};
