import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { Link } from "react-router-dom";

const LaunchBanner = () => {
  const { isAdmin } = useNavigation();
  const title = "LaunchBanner";
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt
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
  return (
    <div className="flex flex-col md:flex-row  md:max-w-[1400px] md:mx-auto p-3 md:p-8 my-16 md:my-20">
      {/* Text Section */}
      <div className="flex flex-col justify-center md:w-1/2 p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Launch Your Career Journey
        </h1>
        <p className="text-gray-700 mb-4 ">
          Join our platform and discover exciting job opportunities tailored for
          college <br /> students like you!
        </p>
        <div className="flex space-x-4">
          {/* <button className="bg-[#D9520E] text-white py-2 px-4 rounded-xl">
            Sign Up
          </button> */}
          <Link
            to="/about"
            className="bg-white border border-black text-black py-2 px-4 "
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 p-4 relative">
        {uploadedFile ? (
          <img
            src={uploadedFile}
            alt="Preview"
            className=" w-[700px] h-[370px] object-cover "
          />
        ) : (
          <img
            src="/JobPortalPage/Placeholder Image.png"
            alt="Career Launch"
            className=" w-[700px] h-[270px] md:h-[370px] object-cover "
          />
        )}
        {/* Admin file upload section */}
        {isAdmin && (
          <div className="absolute top-3 right-4 ">
            {" "}
            <FileUpload handleFileChange={handleFileChange} error={error} />
          </div>
        )}
      </div>
    </div>
  );
};

LaunchBanner.metadata = {
  componentName: "LaunchBanner",
  description:
    "A component that displays a launch banner for career opportunities, allowing admin users to upload a custom banner image.",
  features: {
    adminFileUpload: true, // Allows admin users to upload a custom banner image
    responsiveDesign: true, // Adjusts layout for different screen sizes
    errorHandling: true, // Displays error messages for image fetch and upload failures
    dynamicImageLoading: true, // Loads uploaded images dynamically
  },
  data: {
    title: "LaunchBanner", // Title used for uploaded image
    defaultImage: "/JobPortalPage/Placeholder Image.png", // Default placeholder image path
  },
  accessibility: {
    fileUpload: "Admin users can upload a new banner image.",
    callToAction: "Buttons to sign up or learn more are available for users.",
  },
  styles: {
    container: {
      display: "flex", // Flex layout for the main container
      flexDirection: "column", // Column direction for smaller screens
      padding: "1rem", // Padding for the container
      maxWidth: "1400px", // Max width for larger screens
      margin: "1rem auto", // Center alignment for the container
    },
    textSection: {
      flex: "1", // Takes full height in column layout
      padding: "1rem", // Padding for text section
    },
    imageSection: {
      flex: "1", // Takes full height in column layout
      position: "relative", // Relative positioning for the image section
    },
    button: {
      signUp: {
        backgroundColor: "#D9520E", // Background color for the Sign Up button
        color: "white", // Text color for the Sign Up button
        padding: "0.5rem 1rem", // Padding for the Sign Up button
        borderRadius: "0.375rem", // Rounded corners for the Sign Up button
      },
      learnMore: {
        backgroundColor: "white", // Background color for the Learn More button
        border: "1px solid black", // Border style for the Learn More button
        color: "black", // Text color for the Learn More button
        padding: "0.5rem 1rem", // Padding for the Learn More button
      },
    },
  },
};
export default LaunchBanner;
