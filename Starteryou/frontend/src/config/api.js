// config/api.js
export const API_CONFIG = {
  baseURL: "http://db.starteryou.com:3000",
  endpoints: {
    fileByTitle: (title) => `/api/files/download/${title}`,
    fileUpload: "/api/files/upload",
    fileDownload: (title) => `/api/files/download/${title}`,
    fileUpdate: (title) => `/api/files/update/${title}`,
    fileDelete: (title) => `/api/files/delete/${title}`,
    fileList: "/api/files/list",
    fileCleanup: "/api/files/cleanup",
    textApi: "/api/text",
  },
};
