import {useState, useEffect} from "react";
import FileUpload from "../Common/FileUpload";
import {useNavigation} from "../../context/NavigationContext";
import {API_CONFIG} from "@config/api";
const BestJob = () => {
  const { isAdmin } = useNavigation();
  const [image1, setImage1] = useState("/LandingPage/Rectangle.png");
  const [image2, setImage2] = useState("/LandingPage/Heroimg2.jpg");
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track if fetch attempt is made

  const titles = ["starteryou-v2", "starteryou-v2"];
  
  // Fetch uploaded files for each image (image1 and image2)
  const fetchUploadedImages = async () => {
    if (hasFetchedOnce) return; // Prevent fetching again if already attempted
  
    try {
      // Fetch the image1
      const response1 = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload("starteryou-v2")}`
      );
      if (!response1.ok) {
        throw new Error("Network response was not ok for image1");
      }
      const blob1 = await response1.blob(); // Get the response as a Blob
      const url1 = URL.createObjectURL(blob1); // Create a local URL for the Blob
      setImage1(url1); // Set the uploaded image1 URL
  
      // Fetch the image2
      const response2 = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload("starteryou-v2")}`
      );
      if (!response2.ok) {
        throw new Error("Network response was not ok for image2");
      }
      const blob2 = await response2.blob(); // Get the response as a Blob
      const url2 = URL.createObjectURL(blob2); // Create a local URL for the Blob
      setImage2(url2); // Set the uploaded image2 URL
  
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded images:", error);
      setError("Failed to load images"); // Set error message
    } finally {
      setHasFetchedOnce(true); // Mark as fetch attempt made
    }
  };
  
  useEffect(() => {
    fetchUploadedImages(); // Fetch images on component mount
  }, []);
  
  // Handle file upload for each image
  const handleFileChange = async (event, imageType) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData
    formData.append("title", imageType); // Include the title for the update
  
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(imageType)}`,
        {
          method: "PUT",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error updating image for ${imageType}`);
      }
  
      const data = await response.json();
      console.log(`Image updated successfully for ${imageType}:`, data);
  
      // Update the specific image URL in the state
      if (imageType === "image1") {
        setImage1(URL.createObjectURL(file));
      } else if (imageType === "image2") {
        setImage2(URL.createObjectURL(file));
      }
  
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error(`Error updating image for ${imageType}:`, error);
      setError(`Error updating image for ${imageType}`); // Set error message
    }
  };
  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section */}
        <div className="md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Find the best jobs that define you.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            See new openings &gt;
          </a>
        </div>

        {/* Right Section */}
        <div className="w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl relative">
          {/* First Image */}
          <img
            src={image1}
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[25px] left-[30px] md:w-[320px] md:left-[50px] lg:top-[47px] lg:left-[70px] lg:w-[440px] lg:h-[300px] rounded-xl"
          />
          {isAdmin && (
            <div>
              <FileUpload
                handleFileChange={(e) => handleFileChange(e, titles[0])}
              />
            </div>
          )}

          {/* Second Image */}
          <img
            src={image2}
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[-68px] left-[80px] md:left-[180px] md:w-[320px] lg:top-[-112px] lg:left-[190px] lg:w-[420px] lg:h-[300px] rounded-xl z-10"
          />
          {isAdmin && (
            <div className="relative bottom-32">
              <FileUpload
                handleFileChange={(e) => handleFileChange(e, titles[1])}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestJob;
