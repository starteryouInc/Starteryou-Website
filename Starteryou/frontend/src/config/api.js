export const API_CONFIG = {
  baseURL: "http://54.196.202.145:3000",
  endpoints: {
    fileUpload: "/api/files/upload",
    fileUpdate: "/api/files/update",
    fileByTitle: (title) => `/api/files/title/${title}`,
    getAllFiles: "/api/files",
  },
};
