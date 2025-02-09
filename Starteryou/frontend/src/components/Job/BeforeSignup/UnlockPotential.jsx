import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { MaxWords } from "../../Common/wordValidation";
import { toast } from "react-toastify";

const UnlockPotential = () => {
  const title = "UnlockPotential";
  const [uploadedFile, setUploadedFile] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const { isAdmin } = useNavigation();
  const [titlee, setTitlee] = useState(
    "Unlock Your Potential with Starteryou: Your Path to Career Success"
  );
  const [paragraphh, setParagraphh] = useState(
    "Starteryou offers students the chance to gain valuable work experience while balancing their studies. With flexible job opportunities tailored to your schedule, you can enhance your resume and prepare for a successful career."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";
  const [titleWordsLeft, setTitleWordsLeft] = useState(10); // Counter for the title
  const [paragraphWordsLeft, setParagraphWordsLeft] = useState(30); // Counter for the paragraph

  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return;

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
      setError(null);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image");
    } finally {
      setHasFetchedOnce(true);
    }
  };

  useEffect(() => {
    fetchUploadedFile();
  }, []);

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
        throw new Error("Network response was not ok");
      }
      setUploadedFile(URL.createObjectURL(file));
      setError(null);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
      toast.error("Failed to upload the image.");
    }
  };

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
          setTitlee(response.data.content || titlee);
          setParagraphh(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : paragraphh
          );
        }
      } catch {
        console.error("Error fetching data");
        setError("Unable to load content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) => {
    setTitlee(MaxWords(e.target.value, 10, setTitleWordsLeft));
  };

  const handleChangeParagraph = (e) => {
    setParagraphh(MaxWords(e.target.value, 30, setParagraphWordsLeft));
  };

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraphh)
        ? paragraphh
        : [paragraphh.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page,
        component: "UnlockPotential",
        content: titlee.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError("");
      setIsEditing(false);
      toast.success("Content saved successfully!");
    } catch {
      console.error("Error saving content");
      setError("Error saving content. Please try again later.");
      toast.error("Failed to save content.");
    }
  };

  return (
    <div className="max-w-[1430px] mx-auto px-4 lg:px-10 py-7 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-center">
          {isEditing ? (
            <div>
              <span className="text-sm text-gray-500">
                {titleWordsLeft >= 0
                  ? `${titleWordsLeft} words left`
                  : `Word limit exceeded by ${Math.abs(titleWordsLeft)} words`}
              </span>
              <input
                type="text"
                value={titlee}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 border border-gray-300 p-2 rounded w-full"
              />
              <span className="text-sm text-gray-500">
                {paragraphWordsLeft >= 0
                  ? `${paragraphWordsLeft} words left`
                  : `Word limit exceeded by ${Math.abs(
                      paragraphWordsLeft
                    )} words`}
              </span>
              <textarea
                value={paragraphh}
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
                {titlee}
              </h2>
              <p className="text-base text-black max-w-[470px]">{paragraphh}</p>
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
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Preview"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl left-[30px] top-[30px] md:left-[58px] md:top-[80px]"
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Unlock Potential"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          )}
          {isAdmin && (
            <div className="absolute top-2 right-2">
              <FileUpload
                handleFileChange={handleFileChange}
                uploadedFile={uploadedFile}
                error={error}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlockPotential;
