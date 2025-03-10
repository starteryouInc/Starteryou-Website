import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation";

// const icons = [
//   {
//     src: "/LandingPage/Icons/dashboard.svg",
//     alt: "Dashboard Icon",
//     text: "Home Page",
//     link: "/dashboard",
//   },
//   {
//     src: "/LandingPage/Icons/social.svg",
//     alt: "Settings Icon",
//     text: "School Magazines",
//     link: "/teams-socials",
//   },
//   {
//     src: "/LandingPage/Icons/user-square.svg",
//     alt: "User Icon",
//     text: "XXXXXXXXXXXX",
//     link: "/job-profile",
//   },
//   {
//     src: "/LandingPage/Icons/subscribe.svg",
//     alt: "Analytics Icon",
//     text: "XXXXXXXXXXXX",
//     link: "/subscription-management",
//   },
// ];

const BestJob4 = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const title = "bestjob4"; // Set the title for fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt
  const [titleBJ4, setTitleBJ4] = useState("Best Job 4 Title");
  const [titleCounter, setTitleCounter] = useState(6); // Live word counter for title
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return; // Prevent fetching again if already attempted

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile(url); // Set the uploaded file data with its local URL
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image"); // Set error message
    } finally {
      setHasFetchedOnce(true); // Mark as fetch attempt made
    }
  };

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
  }, []);

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData
    formData.append("title", title); // Include the title for the update

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

      const data = await response.json();
      console.log("Image updated successfully:", data);

      setUploadedFile(URL.createObjectURL(file)); // Update the uploaded file state with the new image preview
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image"); // Set error message
    }
  };

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "BestJob4" },
        }
      );

      setTitleBJ4(data?.content || "");
    } catch (error) {
      console.error("Error fetching textData of BestJob4Comp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "BestJob4",
          content: titleBJ4.trim(),
        }
      );
      setIsEditing(false);
      console.log("BestJob4Comp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occurred while saving the content(BestJob4Comp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center py-16 lg:mt-20 px-4 lg:px-0">
      <div className="max-w-[1200px] h-auto w-full text-center">
        {isEditing ? (
          <div className="flex flex-col items-center space-y-4 z-50">
            <textarea
              value={titleBJ4}
              onChange={(e) =>
                setTitleBJ4(MaxWords(e.target.value, 6, setTitleCounter))
              }
              placeholder="Title here..."
              className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
            />
            <p className="text-sm text-grey-400">
              {titleCounter} words remaining
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
          <p className="relative text-3xl sm:text-4xl md:text-5xl font-bold lg:font-extrabold text-[#1F2329] mb-6 whitespace-pre-wrap">
            {titleBJ4}
            {isAdmin && (
              <FaPencilAlt
                onClick={handleEdit}
                className="cursor-pointer absolute top-0 -right-2 lg:-right-5 text-base"
              />
            )}
          </p>
        )}

        <div className="flex flex-col items-center mt-10">
          {/* Icons for small screens */}
          {/* <div className="flex flex-col items-center space-y-4 sm:hidden">
            <div className="flex flex-wrap justify-center space-x-6">
              {icons.map(({ src, alt, text, link }, index) => (
                <a
                  href={link}
                  key={index}
                  className="flex items-center mb-4 relative text-[#1F2329]"
                >
                  <img src={src} alt={alt} className="w-8 h-8" />
                  <span className="ml-2 text-[9px] sm:text-sm italic font-light text-[#1F2329]">
                    {text}
                  </span>
                </a>
              ))}
            </div>
          </div> */}

          {/* Icons for medium and large screens */}
          {/* <div className="hidden sm:flex flex-wrap justify-center space-x-6">
            {icons.map(({ src, alt, text }, index) => (
              <div
                key={index}
                className="flex items-center mb-4 relative cursor-pointer text-[#1F2329]"
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-[20px] h-[20px] md:w-[20px] md:h-[20px]"
                />
                <span className="ml-2 text-[9px] sm:text-sm italic text-[#1F2329]">
                  {text}
                </span>
              </div>
            ))}
          </div> */}

          {/* Image */}
          <div className="w-[330px] h-[250px] md:w-[550px] lg:w-[1020px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-t-2xl rounded-b-none overflow-hidden relative flex items-center justify-center lg:mt-5">
            {uploadedFile ? (
              <img
                src={uploadedFile}
                alt="Uploaded Image"
                className="relative w-[235px] h-[220px] top-[25px] md:w-[380px] md:h-[200px] lg:w-[900px] lg:h-[460px] lg:top-[50px] object-cover rounded-t-2xl rounded-b-none"
              />
            ) : (
              <img
                src="/LandingPage/Rectangle.png"
                alt="Placeholder"
                className="relative w-[235px] h-[220px] top-[25px] md:w-[380px] md:h-[200px] lg:w-[900px] lg:h-[460px] lg:top-[50px] object-cover rounded-t-2xl rounded-b-none"
              />
            )}
            {/* Admin file upload section */}
            {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
          </div>
        </div>
      </div>
    </div>
  );
};
BestJob4.metadata = {
  componentName: "BestJob4",
  description:
    "A component that allows users to display job-related information, upload images, and edit titles and descriptions for 'Best Job 4'.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to edit
    inputValidation: true, // Validates input fields for word limits
    toastNotifications: true, // Provides feedback on image upload and data save success or error
    adminControls: true, // Allows admin users to edit content
    imageUpload: true, // Supports image uploads for job listings
  },
  data: {
    initialContent: {
      title: "Best Job 4 Title",
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    },
    imageSources: {
      defaultImage: "/LandingPage/defaultImage.png", // Default image before upload
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    wordCount: "Indicates word limits for title.",
    editable: "Allows admins to edit job content easily.",
    imageAltText: "Images have appropriate alt text for accessibility.",
  },
  styles: {
    container: {
      padding: "3rem", // Padding for the main container
      backgroundColor: "white", // Background color for the component
    },
    title: {
      fontSize: "2rem", // Font size for the title
      fontWeight: "bold", // Font weight for the title
    },
    paragraph: {
      fontSize: "1rem", // Font size for the paragraph
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
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for fetching job content
      description: "Fetches the content for the Best Job 4 section based on page and component.",
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
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, // Endpoint for saving job content
      description: "Saves the updated job content.",
      requestBody: {
        page: "HomePage",
        component: "BestJob4",
        content: "string", // Title content
      },
      successResponse: {
        status: 200,
        message: "Job content saved successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while saving content.",
      },
    },
    updateImage: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(":imageType")}`, // Endpoint for updating images
      description: "Updates the image based on the provided title.",
      requestBody: {
        file: "File", // Image file to be uploaded
        title: "string", // Title for the image
      },
      successResponse: {
        status: 200,
        message: "Image updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while updating image.",
      },
    },
  },
};
export default BestJob4;
