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
  const [uploadedFile, setUploadedFile] = useState(null);
  const title = "bestbuddy";
  const [error, setError] = useState(null);

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
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image");
    }
  };

  useEffect(() => {
    fetchUploadedFile();
    return () => {
      if (uploadedFile) {
        URL.revokeObjectURL(uploadedFile);
      }
    };
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
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
    }
  };

  return (
    <div className="bg-white py-20 px-4 sm:py-24">
      {/* Header Section */}
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

      {/* Icons and Uploaded Image */}
      <div className="flex flex-col items-center mt-10">
        {/* Icons */}
        <div className="flex flex-col items-center space-y-4 sm:hidden">
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
        </div>
        {/*  medium and large screens */}
        <div className="hidden sm:flex flex-wrap justify-center space-x-6 ">
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
        </div>
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

export default BestBuddy;
