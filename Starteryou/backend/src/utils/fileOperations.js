// src/utils/fileOperations.js
import {API_CONFIG} from "../config/api";

export const fetchFileByTitle = async (title) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle(title)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error fetching file for ${title}:`, error);
    return null;
  }
};

export const updateFile = async (file, title) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error(`Error updating file for ${title}:`, error);
    throw error;
  }
};
