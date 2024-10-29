export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  endpoints: {
    fileByTitle: (title) => `/api/files/title/${title}`,
    fileUpdate: "/api/files/update",
  },
};
