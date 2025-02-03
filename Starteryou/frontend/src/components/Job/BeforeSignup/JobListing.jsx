import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import axios from "axios"; // Ensure axios is imported
import { FaPencilAlt } from "react-icons/fa"; // Ensure icon is imported
import { API_CONFIG } from "@config/api";
import { MaxWords } from "../../Common/wordValidation";
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

toast.configure();

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
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const [titleWordsLeft, setTitleWordsLeft] = useState(8); // Word counter for title
  const [paragraphWordsLeft, setParagraphWordsLeft] = useState(50); // Word counter for paragraph

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
      toast.success("Image updated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
      toast.error("Failed to update image.");
    }
  };

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
          setTitlee(
            response.data.content ||
              "Discover Job Listings Curated Specifically for College Students"
          );
          setParagraphh(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch {
        console.error("Error fetching data");
        setError("Error fetching content. Please try again later.");
        toast.error("Failed to fetch content.");
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) =>
    setTitlee(MaxWords(e.target.value, 8, setTitleWordsLeft));

  const handleChangeParagraph = (e) =>
    setParagraphh(MaxWords(e.target.value, 50, setParagraphWordsLeft));

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraphh)
        ? paragraphh
        : [paragraphh.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "JobBeforeSignup",
        component: "JobListing",
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
    <div className=" mx-auto max-w-[1430px]  px-4 lg:px-10 py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center">
          {isEditing ? (
            <div>
              <span className="text-gray-500 text-sm">
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
              <span className="text-gray-500 text-sm">
                {paragraphWordsLeft >= 0
                  ? `${paragraphWordsLeft} words left`
                  : `Word limit exceeded by ${Math.abs(paragraphWordsLeft)} words`}
              </span>
              <textarea
                value={paragraphh}
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
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black">
                {titlee}
              </h2>
              <p className="text-black text-base max-w-[470px]">{paragraphh}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  style={{ cursor: "pointer", marginTop: "1rem" }}
                  className="text-black"
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
        <div className="flex-1 relative bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden flex justify-center md:items-center">
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Preview"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl left-[30px] top-[30px] md:left-[58px] md:top-[80px]"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          ) : (
            <p className="text-sm text-center text-gray-500">
              Image preview will appear here...
            </p>
          )}
          {/* Admin file upload section */}
          {isAdmin && (
            <div className=" absolute top-0 right-2 ">
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
