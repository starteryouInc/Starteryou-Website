/**
 * @file OurVision.jsx
 * @description This component represents the "Our Vision" section, displaying a title, a description paragraph, and an image.
 * It includes admin functionalities for editing content and uploading an image.
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
 *
 * @component
 * @returns {JSX.Element} The rendered OurVision component.
 */
const OurVision = () => {
  /**
   * State variables for managing the content, preview, and editing mode.
   * @type {string} title - The title of the section.
   * @type {string} paragraph - The description content of the section.
   * @type {string|null} preview - The image preview URL.
   * @type {File|null} imageFile - The uploaded image file.
   * @type {boolean} isEditing - Whether the admin is in editing mode.
   * @type {boolean} isAdmin - Whether the user is an admin.
   * @type {string} error - Error message to display.
   */
  const [title, setTitle] = useState("OUR VISION");
  const [paragraph, setParagraph] = useState(
    "Starteryou envisions a world where every student has access to diverse job opportunities, gaining essential work experience and building a foundation for their future careers. We aspire to be the go-to Student Employment Hub, continually innovating and expanding our offerings to enhance the job-seeking journey for both students and employers."
  );
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useNavigation();
  const [error, setError] = useState("");
  const page = "AboutPage"; // Specify the page name for the current component.
  /**
   * Fetches initial data for the "Our Vision" section from the API on component mount.
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
      } catch {
        console.error("Error fetching data");
        setError("Error fetching vision content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  /**
   * Handles file input changes and sets the preview for the uploaded image.
   * @param {Event} e - The change event from the file input.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  /**
   * Toggles editing mode for admin users.
   */
  const handleEdit = () => isAdmin && setIsEditing(true);

  /**
   * Updates the title state when the input value changes.
   * @param {Event} e - The change event from the input field.
   */
  const handleChangeTitle = (e) => setTitle(e.target.value);

  /**
   * Updates the paragraph state when the textarea value changes.
   * @param {Event} e - The change event from the textarea field.
   */
  const handleChangeParagraph = (e) => setParagraph(e.target.value);

  /**
   * Saves the updated content to the server.
   * Normalizes the paragraph content into an array format.
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
    } catch {
      console.error("Error saving content");
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
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
              />
              <textarea
                value={paragraph}
                onChange={handleChangeParagraph}
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
          {preview ? (
            <img
              src={preview}
              alt="Preview"
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
        </div>
      </div>
    </div>
  );
};

export default OurVision;
