import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";

const BestJob2 = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const title = "SmartML";
  const { isAdmin } = useNavigation();

  const cleanupFileUrl = useCallback(() => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile);
    }
  }, [uploadedFile]);

  const fetchUploadedFile = async () => {
    try {
      setLoading(true);
      setError(null);
      cleanupFileUrl();

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
        }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Image not found");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Empty image received");
      }

      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError(error.message || "Failed to load image");
      toast.error(error.message || "Failed to load image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedFile();
    return cleanupFileUrl;
  }, [cleanupFileUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("uploadedBy", "admin");

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update file");
      }

      toast.success("Image updated successfully");

      cleanupFileUrl();
      const previewUrl = URL.createObjectURL(file);
      setUploadedFile(previewUrl);

      setTimeout(fetchUploadedFile, 1000);

    } catch (error) {
      console.error("Error updating file:", error);
      setError(error.message || "Failed to update file");
      toast.error(error.message || "Failed to update file");
    } finally {
      setLoading(false);
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
        {/* Right Section */}
        <div className="relative order-2 lg:order-1 w-[330px] h-[250px] md:w-[500px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6853E3] border-t-transparent"></div>
            </div>
          ) : null}

          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Uploaded Preview"
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
              alt="Job Opportunities"
              className="relative w-[340px] h-[180px] top-[35px] left-[30px] md:w-[550px] md:top-[28px] md:left-[50px] lg:top-[78px] lg:left-[70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          )}

          {/* Admin file upload section */}
          {isAdmin && (
            <FileUpload handleFileChange={handleFileChange} />
          )}

          {/* Error display */}
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

        {/* Left Section */}
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

          {/* Boxes */}
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