/**
 * @file OurMission.jsx
 *
 * This component is responsible for displaying and editing the "Our Mission" section of the website.
 * It includes the mission statement title, description paragraph, and an optional image upload feature
 * for admins. The content is fetched from a server on mount and allows admins to edit and save changes.
 *
 * @component
 *
 * @example
 * <OurMission />
 *
 * @returns {JSX.Element} The rendered component displaying the mission title, description, and image.
 */
import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";

/**
 * OurMission component to manage and display the mission statement.
 *
 * - Displays mission statement with title, paragraph, and image.
 * - Admins can edit title, paragraph, and upload an image.
 * - Fetches content from the server on mount.
 *
 * @returns {JSX.Element} The rendered mission statement section with optional edit functionality for admins.
 */
const OurMission = () => {
  // State for title, paragraph, and image preview
  const [title, setTitle] = useState("OUR MISSION");
  const [paragraph, setParagraph] = useState(
    "Starteryou is dedicated to empowering students by providing a vibrant and inclusive platform for discovering career opportunities. We foster a supportive community that bridges the gap between students and employers, facilitating skill development and guiding them towards meaningful career paths. We aim to transform the student learning experience, equipping individuals with essential career skills often overlooked in traditional education settings."
  );
  const [preview, setPreview] = useState(null); // Image preview for admin
  const [imageFile, setImageFile] = useState(null); // Uploaded image file
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const { isAdmin } = useNavigation(); // Check if the user is an admin
  const [error, setError] = useState(""); // Error state for API actions

  /**
   * Fetches mission content from the server.
   * On success, updates the title and paragraph state.
   * On error, displays an error message.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/text", {
          params: { component: "OurMission" },
        });

        if (response.data) {
          setTitle(response.data.content || "Our Mission");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching mission content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  /**
   * Handles file input change for image upload.
   * Sets the image preview and stores the uploaded file.
   *
   * @param {Event} e - The change event from the file input.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file)); // Set image preview URL
    setImageFile(file); // Store the uploaded file
  };

  /**
   * Enables the edit mode for admin users.
   */
  const handleEdit = () => isAdmin && setIsEditing(true);

  /**
   * Updates the title state based on the input value.
   *
   * @param {Event} e - The change event from the input field.
   */
  const handleChangeTitle = (e) => setTitle(e.target.value);

  /**
   * Updates the paragraph state based on the input value.
   *
   * @param {Event} e - The change event from the textarea field.
   */
  const handleChangeParagraph = (e) => setParagraph(e.target.value);

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

      await axios.put("http://localhost:3000/api/text", {
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
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="relative h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px] "
            />
          ) : (
            <img
              src="/JobPortalPage/Placeholder Image.png"
              alt="placeholder"
              className="relative h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px] "
            />
          )}
          {/* File upload section for admin */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
      {/* Error message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default OurMission;
