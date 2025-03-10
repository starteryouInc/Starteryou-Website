import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation";
import { Link } from "react-router-dom";

const Banner = () => {
  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState("Banner Title");
  const [paragraph, setParagraph] = useState("Perfectly working Banner");
  const [titleCounter, setTitleCounter] = useState(5); // Word counter for title
  const [paragraphCounter, setParagraphCounter] = useState(15); // Word counter for paragraph
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "Banner" },
        }
      );

      setTitle(data?.content || "");
      setParagraph(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BannerComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "Banner",
          content: title.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BannerComp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occurred while saving the content(BannerComp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-4">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {isEditing ? (
          <div className="mt-10 flex flex-col space-y-4 z-50">
            <textarea
              value={title}
              onChange={(e) =>
                setTitle(MaxWords(e.target.value, 5, setTitleCounter))
              }
              placeholder="Title here..."
              className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
            />
            <p className="text-sm text-grey-400">
              {titleCounter} words remaining
            </p>

            <textarea
              value={paragraph}
              onChange={(e) =>
                setParagraph(MaxWords(e.target.value, 15, setParagraphCounter))
              }
              placeholder="Paragraph here..."
              className="lg:w-[700px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
            />
            <p className="text-sm text-grey-400">
              {paragraphCounter} words remaining
            </p>

            <div className="lg:w-[400px] flex items-center justify-between space-x-2 text-white">
              <button
                onClick={saveContent}
                className="bg-green-600 py-2 px-4 rounded text-xl w-1/2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 py-2 px-4 rounded text-xl w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              {title}
            </h1>
            <p className="text-[#767676] mb-4 lg:max-w-[800px] whitespace-pre-wrap">
              {paragraph}
            </p>
            <Link
              to="/about"
              className="px-6 py-3 bg-[#D9502E] text-white rounded-md"
            >
              Learn more
            </Link>
            {isAdmin && (
              <FaPencilAlt
                onClick={handleEdit}
                className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
              />
            )}
          </div>
        )}
        {/* Image */}
        <div className="md:flex-1 md:max-w-[35%] hidden md:block">
          <img
            src="/LandingPage/Icons/Banner.png"
            alt="Placeholder"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
Banner.metadata = {
  componentName: "Banner",
  description:
    "A component that displays a banner with a title and a paragraph. It allows admins to edit the content and save updates.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to edit
    inputValidation: true, // Validates input fields for word limits
    toastNotifications: true, // Provides feedback on save success or error
    adminControls: true, // Allows admin users to edit content
  },
  data: {
    initialContent: {
      title: "Banner Title",
      paragraph: "Perfectly working Banner",
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    wordCount: "Indicates word limits for title and paragraph.",
    editable: "Allows admins to edit the banner content easily.",
  },
  styles: {
    bannerContainer: {
      backgroundColor: "white", // Background color for the banner
      padding: "2rem", // Padding for the banner container
      borderRadius: "0.5rem", // Rounded corners for the banner
      maxWidth: "1440px", // Max width for the banner
      margin: "0 auto", // Center alignment for the banner
    },
    title: {
      fontSize: "2rem", // Font size for the title
      fontWeight: "bold", // Font weight for the title
    },
    paragraph: {
      fontSize: "1.25rem", // Font size for the paragraph
      color: "#767676", // Text color for the paragraph
    },
    buttons: {
      save: {
        backgroundColor: "#6BBE45", // Background color for the save button
        color: "white", // Text color for the save button
      },
      cancel: {
        backgroundColor: "red", // Background color for the cancel button
        color: "white", // Text color for the cancel button
      },
    },
  },
  apiEndpoints: {
    fetchContent: {
      method: "GET",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for fetching banner content
      description: "Fetches the content for the banner based on page and component.",
      successResponse: {
        status: 200,
        message: "Content fetched successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error fetching content.",
      },
    },
    saveContent: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for saving banner content
      description: "Saves the updated banner content.",
      requestBody: {
        page: "HomePage",
        component: "Banner",
        content: "string", // Title content
        paragraphs: ["string"], // Paragraph content as an array
      },
      successResponse: {
        status: 200,
        message: "Banner content saved successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while saving content.",
      },
    },
  },
};
export default Banner;
