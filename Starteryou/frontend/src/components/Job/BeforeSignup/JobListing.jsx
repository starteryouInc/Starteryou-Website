import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_CONFIG } from "@config/api";
const JobListing = () => {
  const title = "JobList";
  const [uploadedFile, setUploadedFile] = useState(null);
  const { isAdmin } = useNavigation();
  const [titlee, setTitlee] = useState(
    "Discover Job Listings Curated Specifically for College Students"
  );
  const [paragraphh, setParagraphh] = useState(
    "At Starteryou, we understand the unique needs of college students seeking job opportunities. Our platform offers a tailored selection of job listings designed to help you kickstart your career."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";
  const [titleWordsLeft, setTitleWordsLeft] = useState(MAX_TITLE_WORDS);
  const [paragraphWordsLeft, setParagraphWordsLeft] =
    useState(MAX_PARAGRAPH_WORDS);

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return;

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch file. Status: ${response.status}`);
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile(url); // Set the uploaded file data with its local URL
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image"); // Set error message
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
        throw new Error(`Failed to upload file. Status: ${response.status}`);
      }

      setUploadedFile(URL.createObjectURL(file));
      setError(null);
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
    }
  };

  // Fetch text content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "JobListing" },
          }
        );

        if (response.data) {
          setTitlee(response.data.content || titlee);
          setParagraphh(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : paragraphh
          );
          // toast.success("Content fetched successfully!");
        }
      } catch {
        console.error("Error fetching data");
        setError("Error fetching content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) => setTitlee(e.target.value);

  const handleChangeParagraph = (e) => setParagraphh(e.target.value);
  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraphh)
        ? paragraphh
        : [paragraphh.trim()];

      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page,
          component: "JobListing",
          content: titlee.trim(),
          paragraphs: normalizedParagraphs,
        }
      );

      setError("");
      setIsEditing(false);
    } catch {
      console.error("Error saving content");
      setError("Error saving content. Please try again later.");
    }
  };

  const jobInfo = [
    {
      id: 1,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Find jobs that fit your schedule and skills.",
    },
    {
      id: 2,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Access opportunities from top employers in your area.",
    },
    {
      id: 3,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Start your journey towards a successful career today!",
    },
  ];

  return (
    <div className="mx-auto max-w-[1430px] px-4 lg:px-10 py-14 md:py-20">
      {/* Toast Notification Container */}
      <ToastContainer />

      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-center">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={titlee}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 border border-gray-300 p-2 rounded w-full"
              />
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
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black">
                {titlee}
              </h2>
              <p className="text-black text-base max-w-[470px]">{paragraphh}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  className="text-gray-500 cursor-pointer mt-4"
                />
              )}
            </div>
          )}
          {/* Image and Text Columns */}
          <div className="mt-6 space-y-4">
            {jobInfo.map((info) => (
              <div key={info.id} className="flex items-center space-x-2">
                <img
                  src={info.imageSrc}
                  alt={`Icon ${info.id}`}
                  className="w-6 h-6"
                />
                <p className="text-black text-base">{info.text}</p>
              </div>
            ))}
          </div>
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
            <p className="text-sm text-center text-gray-500">
              Image preview will appear here...
            </p>
          )}
          {isAdmin && (
            <div className=" absolute top-0 right-2 ">
              {" "}
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

export default JobListing;
