// src/hooks/useFileOperations.js
import {useState, useCallback} from "react";
import {API_CONFIG} from "../../config/api";

export const useFileOperations = (title) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const fetchUploadedFile = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle(title)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
    }
  }, [title]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
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

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Image updated successfully:", data);
        setUploadedFile(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error updating image:", error);
      }
    },
    [title]
  );

  return {uploadedFile, fetchUploadedFile, handleFileChange};
};
