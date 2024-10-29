// src/config/api.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  endpoints: {
    fileUpdate: "/api/files/update",
    fileByTitle: (title) => `/api/files/title/${title}`,
    // ... other endpoints
  },
};
