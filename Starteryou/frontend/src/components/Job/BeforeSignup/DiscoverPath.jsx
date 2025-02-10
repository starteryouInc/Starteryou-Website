import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "../../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function for word validation
export const MaxWords = (value, maxWords, setCounter) => {
  const words = value.split(/\s+/).filter(Boolean); // Split input into words
  setCounter(maxWords - words.length); // Update remaining word count
  if (words.length > maxWords) {
    toast.error(`Word limit exceeded! Maximum allowed is ${maxWords} words.`, {
      position: "top-right",
      autoClose: 3000,
    });
    return words.slice(0, maxWords).join(" "); // Truncate the input
  }
  return value;
};

const DiscoverPath = () => {
  const [opportunities, setOpportunities] = useState([
    {
      title:
        "Gain Real-World Experience with Internships and Part-Time Opportunities",
      description:
        "Explore valuable internships and part-time jobs tailored for your academic journey.",
      linkText: "Apply",
      linkUrl: "#",
    },
    {
      title: "Access Essential Career Resources to Boost Your Job Search",
      description:
        "Utilize our comprehensive resources to enhance your job readiness and skills.",
      linkText: "Learn",
      linkUrl: "#",
    },
    {
      title:
        "Streamlined Job Listings for Students Seeking Flexible Work Options",
      description:
        "Find job listings that cater to your unique schedule and academic commitments.",
      linkText: "Browse",
      linkUrl: "#",
    },
  ]);

  const { isAdmin } = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const title = ["discover1", "discover2", "discover3"];
  const [titlee, setTitlee] = useState(
    "Discover Your Path: Opportunities for Students at Your Fingertips"
  );
  const [paragraph, setParagraph] = useState(
    "Our platform simplifies the job application process for college students. With just a few clicks, you can apply for internships and part-time jobs that fit your schedule. Say goodbye to complicated applications and hello to your future!"
  );
  const [titleCounter, setTitleCounter] = useState(10);
  const [paragraphCounter, setParagraphCounter] = useState(35);
  const [isEditing, setIsEditing] = useState(false);
  const page = "JobBeforeSignup";

  // Fetch uploaded images
  const fetchUploadedImages = async () => {
    if (hasFetchedOnce) return;

    try {
      const fetchedImages = await Promise.all(
        title.map(async (title) => {
          const response = await fetch(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
          );
          if (!response.ok) throw new Error(`Failed to fetch image: ${title}`);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        })
      );
      setUploadedFiles(fetchedImages);
      setError(null);
    } catch (error) {
      console.error("Error fetching uploaded images:", error);
      setError("Failed to load images");
    } finally {
      setHasFetchedOnce(true);
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title[index]);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title[index])}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok)
        throw new Error(`Failed to upload image: ${title[index]}`);

      const updatedFiles = [...uploadedFiles];
      updatedFiles[index] = URL.createObjectURL(file);
      setUploadedFiles(updatedFiles);
      setError(null);
      toast.success(`Image for ${title[index]} uploaded successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Error uploading image: ${title[index]}`);
      toast.error(`Error uploading image for ${title[index]}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "DiscoverPath" },
          }
        );

        if (response.data) {
          setTitlee(
            response.data.content ||
              "Discover Your Path: Opportunities for Students at Your Fingertips"
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
        toast.error("Error fetching content. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) =>
    setTitlee(MaxWords(e.target.value, 10, setTitleCounter));

  const handleChangeParagraph = (e) =>
    setParagraph(MaxWords(e.target.value, 35, setParagraphCounter));

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "JobBeforeSignup",
        component: "DiscoverPath",
        content: titlee.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError("");
      setIsEditing(false);
      toast.success("Content saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch {
      console.error("Error saving content");
      setError("Error saving content. Please try again later.");
      toast.error("Error saving content. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1430px] px-4 lg:px-10 py-16">
      <ToastContainer />
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:pb-6 gap-4">
        {isEditing ? (
          <div className="w-full">
            <input
              type="text"
              value={titlee}
              onChange={handleChangeTitle}
              className="text-2xl lg:text-4xl font-bold mb-6 md:mb-0 text-black md:text-left md:max-w-[320px] lg:max-w-[600px] w-full"
            />
            <p className="text-sm text-gray-500 mb-2">
              {titleCounter} words remaining
            </p>
            <textarea
              value={paragraph}
              onChange={handleChangeParagraph}
              className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
              rows={6}
            />
            <p className="text-sm text-gray-500">{paragraphCounter} words remaining</p>
            <button
              onClick={saveContent}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 md:text-left md:max-w-[320px] lg:max-w-[600px]">
              <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-black">
                {titlee}
              </h1>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  style={{ cursor: "pointer", marginTop: "1rem" }}
                  className="text-black"
                />
              )}
            </div>
            <div className="flex-1 md:max-w-[400px] lg:max-w-[540px]">
              <p className="text-black text-base">{paragraph}</p>
            </div>
          </>
        )}
      </div>

      {/* Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {opportunities.map((opportunity, index) => (
          <div key={index} className="relative">
            <img
              src={
                uploadedFiles[index] || "https://via.placeholder.com/800x600"
              }
              alt={opportunity.title}
              className="relative w-[500px] h-[250px] mb-4"
            />
            {isAdmin && (
              <div className="absolute top-4 right-4">
                <label
                  htmlFor={`file-upload-${index}`}
                  className="cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                    <FontAwesomeIcon icon={faUpload} size="lg" />
                  </div>
                </label>
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="hidden"
                  aria-label="Upload Image"
                />
              </div>
            )}
            <h2 className="text-lg font-semibold mb-2 px-1">
              {opportunity.title}
            </h2>
            <p className="text-sm mb-4 px-1">{opportunity.description}</p>
            <a
              href={opportunity.linkUrl}
              className="text-blue-500 font-bold px-1"
            >
              {opportunity.linkText} &gt;
            </a>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPath;
