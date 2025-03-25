import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "./UpcomingFeatures.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
 
// Titles for backend storage
const slidesData = [
  {
    title: "Customized School Home Page ",
    description:
      "Explore clubs, events, and opportunities specific to your school—all in one place!",
  },
  {
    title: "Education Portal ",
    description:
      "Access a diverse range of courses and resources to enhance your skills and knowledge. ",
  },
  {
    title: "School Run Portal",
    description:
      "Schools can manage their own portal, posting exclusive opportunities tailored for their students. ",
  },
];
 
const UpcomingFeatures = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const imageTitles = ["feature1", "feature2", "feature3"];
 
  const fetchUploadedImages = async () => {
    if (hasFetchedOnce) return;
 
    try {
      const filePromises = imageTitles.map(async (title, index) => {
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
        );
        if (!response.ok) throw new Error(`Failed to fetch image: ${title}`);
 
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      });
 
      const fetchedImages = await Promise.all(filePromises);
      setUploadedFiles(fetchedImages);
      setError(null);
    } catch (error) {
      console.error("Error fetching uploaded images:", error);
      setError("Failed to load images");
    } finally {
      setHasFetchedOnce(true);
    }
  };
 
  useEffect(() => {
    fetchUploadedImages();
  }, []);
 
  const handleFileChange = async (event, imageType, index) => {
    const file = event.target.files[0];
    if (!file) return;
 
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", imageType);
 
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(imageType)}`,
        { method: "PUT", body: formData }
      );
 
      if (!response.ok) throw new Error(`Failed to upload image: ${imageType}`);
 
      const updatedFiles = [...uploadedFiles];
      updatedFiles[index] = URL.createObjectURL(file);
      setUploadedFiles(updatedFiles);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Error uploading image: ${imageType}`);
    }
  };
 
  return (
    <div
      className="w-full py-16"
      style={{
        background:
          "linear-gradient(106.35deg, rgba(205, 243, 246, 0.4) -1.21%, rgba(187, 174, 253, 0.4) 106.79%)",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12">
          Upcoming Features
        </h2>
        <div className="w-full mx-auto max-w-[800px]">
          <Carousel
            className="custom-carousel"
            showArrows={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={2500}
            showStatus={false}
            emulateTouch={true}
            swipeable={true}
            showIndicators={false} // Hides the dots
          >
            {slidesData.map((slide, index) => (
              <div key={index} className="relative">
                <div
                  className="relative overflow-hidden"
                  style={{ height: "400px" }}
                >
                  <img
                    src={
                      uploadedFiles[index] ||
                      "https://via.placeholder.com/800x600"
                    }
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {isAdmin && (
                    <div className="absolute top-4 right-4">
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                          <FontAwesomeIcon icon={faUpload} size="lg" />
                        </div>
                      </label>
                      <input
                        id={`file-upload-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(e, imageTitles[index], index)
                        }
                        aria-label="Upload Image"
                      />
                    </div>
                  )}
                </div>
                <div className="text-center mt-4 px-4">
                  <h3 className="text-2xl font-bold">{slide.title}</h3>
                  <p className="text-lg mt-2 text-[#767676]">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
 
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};
 
export default UpcomingFeatures;