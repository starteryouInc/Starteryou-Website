// src/components/Landing/BestBuddy.jsx
import {useEffect} from "react";
import {useNavigation} from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import {useFileOperations} from "../../hooks/useFileOperations";
import {API_CONFIG} from "../../../../backend/config/api";

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
  const title = "bestbuddy";
  const {uploadedFile, fetchUploadedFile, handleFileChange} =
    useFileOperations(title);
  const {isAdmin} = useNavigation();

  useEffect(() => {
    fetchUploadedFile();
  }, [fetchUploadedFile]);

  // Handle image update
  const handleUpdateImage = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate}`,
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

      // Show immediate preview with the new file before re-fetching
      const newUrl = URL.createObjectURL(file);
      setUploadedFile(newUrl);

      // Re-fetch the image using the title after the update
      fetchUploadedFile();
    } catch (error) {
      console.error("Error updating image:", error);
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
      </div>

      {/* Upload and Update Buttons */}
      <div className="flex justify-center mt-4">
        <FileUpload handleFileChange={handleFileChange} />
        {isAdmin && (
          <div className="ml-4">
            <input
              type="file"
              onChange={handleUpdateImage}
              className="hidden"
              id="updateFileInput"
            />
            <label
              htmlFor="updateFileInput"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded"
            >
              Update Image
            </label>
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
