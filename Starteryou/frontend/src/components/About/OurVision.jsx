/**
 * @file OurVision.jsx
 * @description This component represents the "Our Vision" section, displaying a title, a description paragraph, and an image.
 * It includes admin functionalities for editing content and uploading an image, with error handling for file operations.
 * @module OurVision
 */

import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { API_CONFIG } from "@config/api";

/**
 * OurVision Component
 *
 * Displays a section with a title, paragraph, and an image.
 * Allows admin users to edit the content and upload images.
 * Includes error handling for network and file operations.
 *
 * @component
 * @returns {JSX.Element} The rendered OurVision component.
 */
const OurVision = () => {
  /**
   * State variables for managing the content, preview, and editing mode.
   * @type {string} title - The title of the section.
   * @type {string} paragraph - The description content of the section.
   * @type {string|null} uploadedFile - The image preview URL or uploaded image URL.
   * @type {boolean} isEditing - Whether the admin is in editing mode.
   * @type {boolean} isAdmin - Whether the user is an admin.
   * @type {string} error - Error message to display.
   * @type {boolean} hasFetchedOnce - Tracks whether the image has been fetched to avoid redundant fetches.
   */
  const [title, setTitle] = useState("OUR VISION");
  const [paragraph, setParagraph] = useState(
    "Starteryou envisions a world where every student has access to diverse job opportunities, gaining essential work experience and building a foundation for their future careers. We aspire to be the go-to Student Employment Hub, continually innovating and expanding our offerings to enhance the job-seeking journey for both students and employers."
  );
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useNavigation();
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const page = "AboutPage"; // Specify the page name for the current component.

  /**
   * Fetches the uploaded image from the server and sets it for preview.
   * Ensures the fetch happens only once.
   * Handles network or file fetch errors.
   */
  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return; // Prevent redundant fetches.

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the image.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
      setError(null);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image.");
    } finally {
      setHasFetchedOnce(true);
    }
  };

  useEffect(() => {
    fetchUploadedFile();
  }, []);

  /**
   * Handles file upload and updates the image on the server.
   * Displays a preview of the uploaded file upon success.
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload the image.");
      }

      setUploadedFile(URL.createObjectURL(file));
      setError(null);
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image.");
    }
  };

  /**
   * Fetches the initial data for the "Our Vision" section from the API.
   * Populates the title and paragraph fields with fetched content.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "OurVision" },
          }
        );

        if (response.data) {
          setTitle(response.data.content || "Our Vision");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching vision content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  /**
   * Toggles editing mode for admin users.
   */
  const handleEdit = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  /**
   * Saves the updated content to the server and exits editing mode.
   * Normalizes the paragraph content into an array format before saving.
   */
  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "AboutPage",
        component: "OurVision",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving content:", error);
      setError("Error saving content. Please try again later.");
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto container px-4 py-10">
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* Text Box Section */}
        <div className="bg-white p-2 md:p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center md:order-2">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
              />
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
                rows={6}
              />
              <button
                onClick={saveContent}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329]">
                {title}
              </h2>
              <p className="text-[#1F2329] text-base">{paragraph}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  style={{ cursor: "pointer", marginTop: "1rem" }}
                  className="text-gray-500 "
                />
              )}
            </div>
          )}
        </div>

        {/* Image Box Section */}
        <div className="relative flex-1 items-center justify-center rounded-lg mb-4 md:mb-0 h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]">
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Current Image"
              className="relative h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          ) : (
            <img
              src="/AboutPage/vision.svg"
              alt="vision"
              className="relative h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          )}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
          {error && (
            <div className="absolute top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md">
              <p>{error}</p>
              <button
                onClick={fetchUploadedFile}
                className="text-[#6853E3] text-sm hover:underline mt-1"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurVision;
