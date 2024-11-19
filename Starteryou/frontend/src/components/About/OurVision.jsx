import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";

const OurVision = () => {
  // State for managing title, paragraph content, image preview, and editing mode
  const [title, setTitle] = useState("OUR VISION"); // Default title
  const [paragraph, setParagraph] = useState(
    "Starteryou envisions a world where every student has access to diverse job opportunities, gaining essential work experience and building a foundation for their future careers. We aspire to be the go-to Student Employment Hub, continually innovating and expanding our offerings to enhance the job-seeking journey for both students and employers."
  );
  const [preview, setPreview] = useState(null); // Image preview for admin uploads
  const [imageFile, setImageFile] = useState(null); // Uploaded image file
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const { isAdmin } = useNavigation(); // Check if the user is an admin
  const [error, setError] = useState(""); // For displaying error messages

  // Fetch vision data on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call to fetch content for the "Our Vision" section
        const response = await axios.get("http://localhost:3000/api/text", {
          params: { component: "OurVision" },
        });

        // Update state with fetched data
        if (response.data) {
          setTitle(response.data.content || "Our Vision");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n") // Join multiple paragraphs into a single string
              : "Your description paragraph here." // Default text
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching vision content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Handle file input change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file)); // Generate a preview for the uploaded image
    setImageFile(file); // Save the file for further processing
  };

  // Toggle editing mode for admin users
  const handleEdit = () => isAdmin && setIsEditing(true);

  // Update state when title or paragraph input changes
  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeParagraph = (e) => setParagraph(e.target.value);

  // Save updated content to the server
  const saveContent = async () => {
    try {
      // Normalize paragraph into an array if it's a string
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      // API call to save updated content
      await axios.put("http://localhost:3000/api/text", {
        component: "OurVision",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError(""); // Clear errors if save is successful
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error saving content:", error.response || error.message);
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
              {/* Editable Title Input */}
              <input
                type="text"
                value={title}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
              />
              {/* Editable Paragraph Input */}
              <textarea
                value={paragraph}
                onChange={handleChangeParagraph}
                className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
                rows={6}
              />
              {/* Save Button */}
              <button
                onClick={saveContent}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              {/* Display Title */}
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329]">
                {title}
              </h2>
              {/* Display Paragraph */}
              <p className="text-[#1F2329] text-base">{paragraph}</p>
              {/* Edit Icon for Admin */}
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
          {/* Display Image Preview or Placeholder */}
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
          {/* Admin File Upload */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
      {/* Display Error Message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default OurVision;
