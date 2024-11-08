import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";

const BestJob2 = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // For both uploaded and previewed images
  const title = "starteryou-v2"; // Set the title for fetching and uploading
  const [loading, setLoading] = useState(false); // Loading state for image fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetched, setHasFetched] = useState(false); // Flag to track if fetch has been attempted

  const fetchUploadedFile = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const blob = await response.blob(); // Get the response as a Blob
      console.log("Fetched blob:", blob); // Log the blob to ensure it's valid
  
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile(url); // Set the uploaded file data with its local URL
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image"); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchUploadedFile(); // Fetch the specific image on component mount
      setHasFetched(true); // Set the flag to true after the first fetch
    }

    // Cleanup function to revoke the Blob URL
    return () => {
      if (uploadedFile) {
        URL.revokeObjectURL(uploadedFile);
      }
    };
  }, [hasFetched, uploadedFile]);

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData
    formData.append("title", title); // Include the title for the update

    setLoading(true); // Start loading

    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Image updated successfully:", data);

      // Create a new Blob URL for the newly uploaded file
      setUploadedFile(URL.createObjectURL(file)); // Update the uploaded file state with the new image preview
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image"); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const boxes = [
    {
      id: 0,
      iconSrc: "/LandingPage/Icons/page 1.svg",
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 1,
      iconSrc: "/LandingPage/Icons/userr.svg",
      title: "Learn from the best",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Image Display Section */}
        <div className="relative order-2 lg:order-1 w-[330px] h-[250px] md:w-[500px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6853E3] border-t-transparent"></div>
            </div>
          )}

          {/* Main Image */}
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Current Image"
              className="relative w-[340px] h-[180px] top-[35px] left-[30px] md:w-[550px] md:top-[28px] md:left-[50px] lg:top-[78px] lg:left-[70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-6.44deg)" }}
              onError={() => {
                setError("Failed to load image");
                setUploadedFile(null);
              }}
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Default Image"
              className="relative w-[340px] h-[180px] top-[35px] left-[30px] md:w-[550px] md:top-[28px] md:left-[50px] lg:top-[78px] lg:left-[70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          )}

          {/* Admin Update Control */}
          {isAdmin && (
            <FileUpload handleFileChange={handleFileChange} />
          )}

          {/* Error Display */}
          {error && (
            <div className="absolute top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-md">
              <p>{error}</p>
              <button 
                onClick={fetchUploadedFile}
                className="text-[#6853E3] text-sm hover:underline mt-1"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="order-1 lg:order-2 md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Eww ipsum dolor sit amet.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            Request for demo &gt;
          </a>

          {/* Feature Boxes */}
          <div className="mt-8 flex flex-col md:flex-row md:justify-between lg:flex-col md:space-x-2 space-y-4 md:space-y-0 md:px-10 lg:space-x-0 lg:px-0">
            {boxes.map((box) => (
              <div
                key={box.id}
                className="p-4 rounded-xl cursor-pointer shadow-none md:w-[300px] md:h-[200px] lg:h-auto lg:w-auto"
              >
                <div className="flex items-center space-x-4">
                  <img src={box.iconSrc} alt={box.title} className="w-8 h-8" />
                  <h3 className="text-xl font-bold text-black">{box.title}</h3>
                </div>
                <p className="mt-4 text-gray-600 text-lg font-thin text-left">
                  {box.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestJob2;
