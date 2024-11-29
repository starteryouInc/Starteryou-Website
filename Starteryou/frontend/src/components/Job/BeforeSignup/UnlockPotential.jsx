import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";

const UnlockPotential = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState(
    "Unlock Your Potential with Starteryou: Your Path to Career Success"
  );
  const [paragraph, setParagraph] = useState(
    "Starteryou offers students the chance to gain valuable work experience while balancing their studies. With flexible job opportunities tailored to your schedule, you can enhance your resume and prepare for a successful career."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "UnlockPotential" },
          }
        );

        if (response.data) {
          setTitle(response.data.content || title);
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : paragraph
          );
        }
      } catch {
        console.error("Error fetching data");
        setError("Unable to load content. Please try again later.");
      }
    };

    fetchData();
  }, [title, paragraph]);

  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) => setTitle(e.target.value);

  const handleChangeParagraph = (e) => setParagraph(e.target.value);

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page,
        component: "UnlockPotential",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };

  return (
    <div className="max-w-[1430px] mx-auto px-4 lg:px-10 py-7 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-center">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 border border-gray-300 p-2 rounded w-full"
              />
              <textarea
                value={paragraph}
                onChange={handleChangeParagraph}
                className="text-base border border-gray-300 p-2 rounded w-full"
                rows={6}
              />
              <button
                onClick={saveContent}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black lg:max-w-[500px]">
                {title}
              </h2>
              <p className="text-base text-black max-w-[470px]">{paragraph}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  className="text-gray-500 cursor-pointer mt-4"
                />
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 relative bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden flex justify-center items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl transform rotate-[-6.44deg]"
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Unlock Potential"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl transform rotate-[-6.44deg]"
            />
          )}
          {isAdmin && (
            <div className="absolute top-2 right-2">
              <FileUpload handleFileChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlockPotential;
