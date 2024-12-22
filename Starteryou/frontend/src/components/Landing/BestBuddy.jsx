import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";

const icons = [
  {
    src: "/LandingPage/Icons/dashboard.svg",
    alt: "Dashboard Icon",
    text: "Dashboard",
    link: "/dashboard",
  },
  {
    src: "/LandingPage/Icons/social.svg",
    alt: "Settings Icon",
    text: "Teams and socials",
    link: "/teams-socials",
  },
  {
    src: "/LandingPage/Icons/user-square.svg",
    alt: "User Icon",
    text: "Job Profile",
    link: "/job-profile",
  },
  {
    src: "/LandingPage/Icons/subscribe.svg",
    alt: "Analytics Icon",
    text: "Subscription Management",
    link: "/subscription-management",
  },
  {
    src: "/LandingPage/Icons/Setting.png",
    alt: "Tools Icon",
    text: "Lorem ipsum",
    link: "/lorem-ipsum",
  },
];

const BestBuddy = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const title = "bestbuddy"; // Set the title for fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt

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
  return (
    <div className="bg-white py-20 px-4 sm:py-24">
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold lg:font-extrabold text-[#1F2329] mb-6">
          The best buddy for your career
        </h2>
        <p className="text-[#1F2329] text-base font-light sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      {/* Display the uploaded file */}
      <div className="relative flex justify-center mt-2">
        {/* Display the uploaded file */}
        {uploadedFile ? (
          <img
            src={uploadedFile}
            alt="Uploaded"
            className="w-[900px] h-[300px] md:h-[450px]"
          />
        ) : (
          <img
            src="/JobPortalPage/Placeholder Image.png"
            alt="Placeholder"
            className="w-[900px] h-[300px] md:h-[450px]"
          />
        )}

        {/* Upload Icon at the Top-Right Corner */}
        {isAdmin && (
          <div className="relative ">
            <FileUpload
              handleFileChange={(e) => handleFileChange(e, title[1])}
            />
          </div>
        )}
      </div>

      {/* Icons Section */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-6xl mx-auto px-4">
        {icons.map((icon, index) => (
          <a
            key={index}
            href={icon.link}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center">
              <img src={icon.src} alt={icon.alt} className="w-8 h-8" />
            </div>
            <span className="text-[#1F2329] text-sm font-medium group-hover:text-blue-600">
              {icon.text}
            </span>
          </a>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
          <p className="text-gray-600">
            Description of feature 1 and its benefits.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
          <p className="text-gray-600">
            Description of feature 2 and its benefits.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
          <p className="text-gray-600">
            Description of feature 3 and its benefits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BestBuddy;
