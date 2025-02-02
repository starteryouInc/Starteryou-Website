import { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { FaPencilAlt } from "react-icons/fa"; // Ensure icon is imported
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import { MaxWords } from "../../Common/wordValidation";

import { API_CONFIG } from "@config/api";
const HeroJobPortal = () => {
  const { isAdmin } = useNavigation();
  const title = "JobHeroBefore";

  const [titlee, setTitlee] = useState(
    "Empowering College Students to Discover Job Opportunities" // Set default title
  );

  const [paragraph, setParagraph] = useState(
    "Starteryou is your go-to platform for college students seeking job listings that match their skills and aspirations. With a user-friendly interface and tailored opportunities, we make job hunting a breeze."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt
  const [titleWordsLeft, setTitleWordsLeft] = useState(8); // Counter for the title
  const [paragraphWordsLeft, setParagraphWordsLeft] = useState(30); //
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: {
              page,
              component:
                "Empowering College Students to Discover Job Opportunities",
            },
          }
        );

        if (response.data) {
          setTitlee(
            response.data.content ||
              "Empowering College Students to Discover Job Opportunities"
          );
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

  const handleEdit = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  const handleChangeTitle = (e) =>
    setTitlee(MaxWords(e.target.value, 8, setTitleWordsLeft));

  const handleChangeParagraph = (e) =>
    setParagraph(MaxWords(e.target.value, 30, setParagraphWordsLeft));

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "JobBeforeSignup",
        component: "HeroJobBefore",
        content: titlee.trim(),
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
    <div className="bg-[#6A54DF] min-h-screen flex flex-col items-center justify-center p-4 md:pt-[100px] pt-[200px] lg:pt-[200px]">
      <div className="text-center max-w-[700px] mx-auto">
        {isEditing ? (
          <div>
            <span className="text-white text-sm">
              {titleWordsLeft >= 0
                ? `${titleWordsLeft} words left`
                : `Word limit exceeded by ${Math.abs(titleWordsLeft)} words`}
            </span>
            <input
              type="text"
              value={titlee}
              onChange={handleChangeTitle}
              className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
            />
            <span className="text-white text-sm">
              {paragraphWordsLeft >= 0
                ? `${paragraphWordsLeft} words left`
                : `Word limit exceeded by ${Math.abs(
                    paragraphWordsLeft
                  )} words`}
            </span>
            <textarea
              value={paragraph}
              onChange={handleChangeParagraph}
              className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              {titlee}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white">{paragraph}</p>
            {isAdmin && (
              <FaPencilAlt
                onClick={handleEdit}
                style={{ cursor: "pointer", marginTop: "1rem" }}
                className="text-white"
              />
            )}
          </div>
        )}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-[#D9502E] text-white py-3 px-8 rounded-lg font-semibold">
            Explore
          </button>
          <button className="bg-white text-[#D9502E] py-3 px-8 rounded-lg font-semibold">
            Signup
          </button>
        </div>
      </div>
      <div className="relative">
        {uploadedFile ? (
          <img
            src={uploadedFile}
            alt="Job Opportunities Preview"
            className="relative w-[1500px] lg:h-[800px] md:px-20 lg:mt-10"
          />
        ) : (
          <p className="text-sm text-center text-gray-500">
            Image preview will appear here...
          </p>
        )}
        {isAdmin && (
          <div className="absolute right-1 top-0 md:top-14 md:right-20">
            <FileUpload handleFileChange={handleFileChange} error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroJobPortal;
