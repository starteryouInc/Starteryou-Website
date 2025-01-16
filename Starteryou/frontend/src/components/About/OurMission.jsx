/**
 * @file OurMission.jsx
 *
 * @description
 * This component manages the "Our Mission" section of the website. It displays the mission title, description, and an optional image. Admin users can edit the content, including uploading an image, while regular users can only view it. The component fetches content from a server on mount and provides real-time editing and saving functionality for admins.
 *
 * @component
 *
 * @example
 * <OurMission />
 *
 * @returns {JSX.Element} The rendered component displaying the mission statement, optional admin editing tools, and an image upload feature.
 *
 * Features:
 * - Displays mission title, description, and optional image.
 * - Admin-only functionality includes editing title, description, and uploading an image.
 * - Fetches text and image content from the server upon mounting.
 * - Provides error handling for fetching and saving actions.
 * - Responsive design for both text and image sections.
 */

import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { API_CONFIG } from "@config/api";
import { MaxWords } from "../Common/wordValidation";
const OurMission = () => {
  // State for title, paragraph, and image preview
  const [title, setTitle] = useState("OUR MISSION");
  const [paragraph, setParagraph] = useState(
    "Starteryou is dedicated to empowering students by providing a vibrant and inclusive platform for discovering career opportunities. We foster a supportive community that bridges the gap between students and employers, facilitating skill development and guiding them towards meaningful career paths. We aim to transform the student learning experience, equipping individuals with essential career skills often overlooked in traditional education settings."
  );

  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const { isAdmin } = useNavigation(); // Check if the user is an admin
  const [error, setError] = useState(""); // Error state for API actions
  const page = "AboutPage"; // Specify the page name for the current component.
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt

  /**
   * Fetches mission content from the server.
   * On success, updates the title and paragraph state.
   * On error, displays an error message.
   */
  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return; // Prevent fetching again if already attempted

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile(url); // Set the uploaded file data with its local URL
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image"); // Set error message
    } finally {
      setHasFetchedOnce(true); // Mark as fetch attempt made
    }
  };

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
  }, []);

  /**
   * Handles the image upload process.
   * Sends the file and title to the server and updates the preview.
   *
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData
    formData.append("title", title); // Include the title for the update

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`,
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

      setUploadedFile(URL.createObjectURL(file)); // Update the uploaded file state with the new image preview
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image"); // Set error message
    }
  };

  /**
   * Fetches the text content for the mission statement from the server.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "OurMission" },
          }
        );

        if (response.data) {
          setTitle(response.data.content || "Our Mission");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch {
        console.error("Error fetching data");
        setError("Error fetching content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  /**
   * Enables the edit mode for admin users.
   */
  const handleEdit = () => isAdmin && setIsEditing(true);

  /**
   * Updates the title state based on the input value.
   *
   * @param {Event} e - The change event from the input field.
   */
  const handleChangeTitle = (e) => setTitle(MaxWords(e.target.value, 3));

  /**
   * Updates the paragraph state based on the input value.
   *
   * @param {Event} e - The change event from the textarea field.
   */

  const handleChangeParagraph = (e) => {
    setParagraph(MaxWords(e.target.value, 84)); // Limit to 84 words
  };
  /**
   * Saves the edited title and paragraph content to the server.
   *
   * @async
   * @function saveContent
   * @throws {Error} If the save operation fails, displays an error message.
   */
  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()]; // Ensure paragraphs are stored as an array

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "AboutPage",
        component: "OurMission",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError("");
      setIsEditing(false); // Exit edit mode after successful save
    } catch (error) {
      console.error("Error saving content:", error.response || error.message);
      setError("Error saving content. Please try again later.");
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto container px-4 pt-4">
      <div className="flex flex-col md:flex-row md:space-x-4 items-center">
        {/* Text Section */}
        <div className="bg-white p-2 md:p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center">
          {isEditing ? (
            <div>
              {/* Input for title editing */}
              <input
                type="text"
                value={title}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
              />
              {/* Textarea for paragraph editing */}
              <textarea
                value={paragraph}
                onChange={handleChangeParagraph}
                className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
                rows={6}
              />
              {/* Save button */}
              <button
                onClick={saveContent}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              {/* Display title and paragraph */}
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329]">
                {title}
              </h2>
              <p className="text-[#1F2329] text-base">{paragraph}</p>
              {/* Edit icon for admin users */}
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

        {/* Image Section */}
        <div className="relative md:flex-1 w-full bg-cover bg-center rounded-lg mb-4 md:mb-0 h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px]">
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Current Image"
              className="relative h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px] rounded-xl"
            />
          ) : (
            <p className="text-sm text-center text-gray-500">
              Image preview will appear here...
            </p>
          )}

          {isAdmin && (
            <FileUpload
              handleFileChange={handleFileChange}
              error={error}
              uploadedFile={uploadedFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OurMission;
