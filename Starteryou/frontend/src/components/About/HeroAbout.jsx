import { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigation } from "../../context/NavigationContext";

const HeroAbout = () => {
  // States for handling title, paragraph content, edit mode, and error messages
  const [title, setTitle] = useState("xxxxxxxxxxxxxxxxxxx");
  const [paragraph, setParagraph] = useState(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin } = useNavigation();

  // Fetch content for the HeroAbout component on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/text", {
          params: { component: "HeroAbout" },
        });

        if (response.data) {
          // Update state with fetched data, combining paragraphs if provided as an array
          setTitle(response.data.content || "Your Hero Title Here");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Enable edit mode only if the user is an admin
  const handleEdit = () => isAdmin && setIsEditing(true);

  // Update state when the user edits the title or paragraph
  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeParagraph = (e) => setParagraph(e.target.value);

  // Save updated content to the backend
  const saveContent = async () => {
    try {
      // Ensure paragraphs are stored as an array
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put("http://localhost:3000/api/text", {
        component: "HeroAbout",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError(""); // Clear any previous errors
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving content:", error.response || error.message);
      setError("Error saving content. Please try again later.");
    }
  };

  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/AboutPage/Aboutbg.svg)" }}
    >
      {/* Overlay for better contrast */}
      <div className="relative z-10 flex justify-center items-center h-full overflow-hidden">
        {/* Container with two boxes in a row for mid and large screens */}
        <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:space-x-6 lg:space-x-12 max-w-6xl p-6 lg:p-12 space-y-6 md:space-y-0">
          {/* Image Container */}
          <div className="w-full md:w-1/2 md:flex justify-center mb-6 md:mb-[-25px] lg:mb-[-144px] hidden">
            <img
              src="/AboutPage/aboutMen.svg"
              alt="Your Image"
              className="w-full h-[400px] md:h-[450px] lg:h-[700px] object-cover"
            />
          </div>
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 pt-[100px] md:pt-0">
            {isEditing ? (
              <div>
                {/* Title Input */}
                <textarea
                  value={title}
                  onChange={handleChangeTitle}
                  className="text-3xl lg:text-4xl font-semibold text-white bg-transparent border border-white p-2 rounded resize-none focus:outline-none"
                />
                {/* Paragraph Input */}
                <textarea
                  value={paragraph}
                  onChange={handleChangeParagraph}
                  className="text-lg lg:text-xl text-gray-300 bg-transparent border border-gray-300 p-2 mt-4 rounded resize-none focus:outline-none"
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
                {/* Display Title and Paragraph */}
                <h1 className="text-3xl lg:text-5xl font-semibold text-white break-words mb-6">
                  {title}
                </h1>
                <p className="text-lg lg:text-xl text-gray-300">{paragraph}</p>
                {/* Edit Icon for Admin */}
                {isAdmin && (
                  <FaPencilAlt
                    onClick={handleEdit}
                    style={{ cursor: "pointer", marginTop: "1rem" }}
                    className="text-gray-300 hover:text-white"
                  />
                )}
              </div>
            )}
            {/* Buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <button className="bg-[#D9502E] text-white py-2 px-6 rounded-lg font-semibold">
                Get Demo
              </button>
              <button className="bg-white text-[#D9502E] py-2 px-6 rounded-lg font-semibold">
                Try for Free
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default HeroAbout;
