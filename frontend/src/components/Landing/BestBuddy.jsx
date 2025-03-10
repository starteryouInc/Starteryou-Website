import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
// import { toast } from 'react-hot-toast';
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation";

// const icons = [
//   {
//     src: "/LandingPage/Icons/dashboard.svg",
//     alt: "Dashboard Icon",
//     text: "Dashboard",
//     link: "/dashboard",
//   },
//   {
//     src: "/LandingPage/Icons/social.svg",
//     alt: "Settings Icon",
//     text: "Teams and socials",
//     link: "/teams-socials",
//   },
//   {
//     src: "/LandingPage/Icons/user-square.svg",
//     alt: "User Icon",
//     text: "Job Profile",
//     link: "/job-profile",
//   },
//   {
//     src: "/LandingPage/Icons/subscribe.svg",
//     alt: "Analytics Icon",
//     text: "Subscription Management",
//     link: "/subscription-management",
//   },
//   {
//     src: "/LandingPage/Icons/Setting.png",
//     alt: "Tools Icon",
//     text: "Lorem ipsum",
//     link: "/lorem-ipsum",
//   },
// ];

const BestBuddy = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null);
  const title = "bestbuddy";
  const [error, setError] = useState(null);

  // States for text content and counters
  const [titleBB, setTitleBB] = useState("The best buddy for your career");
  const [paragraphBB, setParagraphBB] = useState("Perfectly working BestBuddy");
  const [titleCounter, setTitleCounter] = useState(6); // Remaining word count for title
  const [paragraphCounter, setParagraphCounter] = useState(30); // Remaining word count for paragraph
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const fetchUploadedFile = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      setUploadedFile(URL.createObjectURL(blob));
      setError(null);
    } catch (error) {
      // console.error("Error fetching uploaded file:", error);
      setError("Failed to load image");
    }
  };

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
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
    }
  };

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "BestBuddy" },
        }
      );

      setTitleBB(data?.content || "");
      setParagraphBB(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BestBuddyComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraphBB)
        ? paragraphBB
        : [paragraphBB.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "BestBuddy",
          content: titleBB.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BestBuddyComp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occurred while saving the content (BestBuddyComp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchUploadedFile();
    fetchData();
    return () => {
      if (uploadedFile) {
        URL.revokeObjectURL(uploadedFile);
      }
    };
  }, []);

  // Update title and paragraph with MaxWords and counters
  const handleTitleChange = (e) => {
    setTitleBB(MaxWords(e.target.value, 6, setTitleCounter));
  };

  const handleParagraphChange = (e) => {
    setParagraphBB(MaxWords(e.target.value, 30, setParagraphCounter));
  };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="bg-white py-20 px-4 sm:py-24">
      {isEditing ? (
        <div className="mt-10 flex flex-col items-center space-y-4 z-50">
          <textarea
            value={titleBB}
            onChange={handleTitleChange}
            placeholder="Title here..."
            className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
          />
          <p className="text-sm text-grey-400">
            {titleCounter} words remaining
          </p>

          <textarea
            value={paragraphBB}
            onChange={handleParagraphChange}
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
        <div className="relative md:max-w-3xl lg:max-w-4xl mx-auto text-center">
          {/* Header Section */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold lg:font-extrabold text-[#1F2329] mb-6">
            {titleBB}
          </h2>
          <p className="text-[#1F2329] text-base font-light sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto whitespace-pre-wrap">
            {paragraphBB}
          </p>
          {isAdmin && (
            <FaPencilAlt
              onClick={handleEdit}
              className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
            />
          )}
        </div>
      )}

      {/* Icons and Uploaded Image */}
      <div className="flex flex-col items-center mt-10">
        {/* Icons */}
        {/* <div className="flex flex-col items-center space-y-4 sm:hidden">
          <div className="flex flex-wrap justify-center space-x-6">
            {icons.map(({ src, alt, text, link }, index) => (
              <a href={link} key={index} className="flex items-center mb-4">
                {" "}
                <img
                  src={src}
                  alt={alt}
                  className="w-[20px] h-[20px] md:w-[20px] md:h-[20px]"
                />
                <span className="ml-2 text-[9px] sm:text-sm italic text-[#1F2329]">
                  {text}
                </span>
              </a>
            ))}
          </div>
        </div> */}

        {/*  medium and large screens */}
        {/* <div className="hidden sm:flex flex-wrap justify-center space-x-6 ">
          {icons.map(({ src, alt, text, link }, index) => (
            <a href={link} key={index} className="flex items-center mb-4">
              <img
                src={src}
                alt={alt}
                className="w-[20px] h-[20px] md:w-[20px] md:h-[20px]"
              />
              <span className="ml-2 text-[9px] sm:text-sm italic text-[#1F2329]">
                {text}
              </span>
            </a>
          ))}
        </div> */}
        {/* Uploaded File */}
        <div className="relative flex justify-center mt-2">
          <img
            src={uploadedFile || "/JobPortalPage/Placeholder Image.png"}
            alt={uploadedFile ? "Uploaded Image" : "Placeholder Image"}
            className="w-full h-auto max-w-[900px] max-h-[450px] object-cover"
          />
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
    </div>
  );
};
BestBuddy.metadata = {
  componentName: "BestBuddy",
  description:
    "A component that displays a section to promote BestBuddy, allowing users to edit the title and paragraph content, as well as upload an associated file.",
  features: {
    fileUpload: true, // Allows users to upload an image file
    textEditing: true, // Enables editing of the title and paragraph text
    characterLimit: true, // Limits the number of words for title and paragraph
    toastNotifications: true, // Provides feedback on upload and save actions
    adminControls: true, // Only admins can edit the content
  },
  data: {
    initialContent: {
      title: "The best buddy for your career",
      paragraph: "Perfectly working BestBuddy",
    },
  },
  accessibility: {
    textFields: "Text areas are accessible and labeled for screen readers.",
    characterCount: "Displays remaining word count for user guidance.",
    fileUpload: "File upload input is clearly labeled for better accessibility.",
  },
  styles: {
    container: {
      backgroundColor: "white", // Background color for the component
      padding: "2rem", // Padding for the component
      border: "1px solid #E5E7EB", // Border style for the component
      borderRadius: "0.5rem", // Rounded corners for the component
      maxWidth: "800px", // Max width for the component
      margin: "0 auto", // Center alignment for the component
    },
    titleInput: {
      border: "1px solid #D1D5DB", // Border color for title input
      padding: "0.5rem", // Padding for title input
      borderRadius: "0.375rem", // Rounded corners for title input
      width: "100%", // Full width for title input
    },
    paragraphInput: {
      border: "1px solid #D1D5DB", // Border color for paragraph input
      padding: "0.5rem", // Padding for paragraph input
      borderRadius: "0.375rem", // Rounded corners for paragraph input
      width: "100%", // Full width for paragraph input
    },
    button: {
      save: {
        backgroundColor: "#6B46C1", // Background color for the save button
        color: "white", // Text color for the save button
        padding: "0.5rem 1rem", // Padding for the save button
        borderRadius: "0.375rem", // Rounded corners for the save button
      },
      cancel: {
        backgroundColor: "white", // Background color for the cancel button
        color: "#6B46C1", // Text color for the cancel button
        padding: "0.5rem 1rem", // Padding for the cancel button
        borderRadius: "0.375rem", // Rounded corners for the cancel button
      },
    },
  },
  apiEndpoints: {
    fetchTextData: {
      method: "GET",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for fetching text data
      description: "Fetches the text data for the BestBuddy component.",
      successResponse: {
        status: 200,
        message: "Text data fetched successfully.",
        data: {
          content: "string", // Title content
          paragraphs: ["string"], // Array of paragraph strings
        },
      },
      errorResponse: {
        status: 404,
        message: "Text data not found.",
      },
    },
    updateTextData: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for updating text data
      description: "Updates the title and paragraphs for the BestBuddy component.",
      requestBody: {
        page: "HomePage", // Page where the component is located
        component: "BestBuddy", // Component name
        content: "string", // Updated title content
        paragraphs: ["string"], // Updated paragraphs array
      },
      successResponse: {
        status: 200,
        message: "Text data updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error message describing what went wrong.",
      },
    },
    uploadFile: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate("bestbuddy")}`, // Endpoint for uploading a file
      description: "Uploads a file associated with the BestBuddy component.",
      headers: {
        Authorization: "Bearer <token>", // Bearer token for user authentication
      },
      requestBody: {
        file: "File", // File to be uploaded
        title: "string", // Title for the uploaded file
      },
      successResponse: {
        status: 200,
        message: "File uploaded successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error message describing what went wrong.",
      },
    },
  },
};
export default BestBuddy;
