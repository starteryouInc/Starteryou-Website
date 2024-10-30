// src/config/api.config.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://54.196.202.145:3000",
  endpoints: {
    fileUpload: "/api/files/upload",
    fileUpdate: "/api/files/update",
    fileByTitle: (title) => `/api/files/title/${title}`,
    getAllFiles: "/api/files",
  },
};

// Add debug logging
console.log('API Config baseURL:', API_CONFIG.baseURL);