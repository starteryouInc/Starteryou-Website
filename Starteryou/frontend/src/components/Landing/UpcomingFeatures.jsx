import {useState, useEffect} from "react";
import FileUpload from "../Common/FileUpload";
import {useNavigation} from "../../context/NavigationContext";
import {API_CONFIG} from "@config/api";

// Titles for backend storage

const slidesData = [
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "", // Empty initially, will be fetched
  },
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "",
  },
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "",
  },
];
const UpcomingFeatures = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const imageTitles = ["uf1", "uf2", "uf3"];

  const fetchUploadedImages = async () => {
    if (hasFetchedOnce) return;

    try {
      const filePromises = imageTitles.map(async (title, index) => {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`);
        if (!response.ok) throw new Error(`Network response was not ok for ${title}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { index, url };
      });

      const fetchedImages = await Promise.all(filePromises);
      const updatedFiles = [...uploadedFiles];
      fetchedImages.forEach(({ index, url }) => {
        updatedFiles[index] = url;
      });

      setUploadedFiles(updatedFiles);
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

  const handleFileChange = async (event, imageType) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", imageType);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(imageType)}`,
        { method: "PUT", body: formData }
      );

      if (!response.ok) throw new Error(`Error updating image for ${imageType}`);

      const data = await response.json();
      console.log(`Image updated successfully for ${imageType}:`, data);

      const updatedFiles = [...uploadedFiles];
      const index = imageTitles.indexOf(imageType);
      updatedFiles[index] = URL.createObjectURL(file);
      setUploadedFiles(updatedFiles);
      setError(null);
    } catch (error) {
      console.error(`Error updating image for ${imageType}:`, error);
      setError(`Error updating image for ${imageType}`);
    }
  };

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12">Upcoming Features</h2>
        <div className="w-full mx-auto max-w-[800px]">
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            showStatus={false}
            emulateTouch={true}
            swipeable={true}
          >
            {slidesData.map((slide, index) => (
              <div key={index} className="relative">
                <img
                  src={uploadedFiles[index] || "https://via.placeholder.com/800X600"}
                  className="object-cover mx-auto px-4 lg:px-0"
                  style={{ height: "400px", width: "100%" }}
                  alt={`Slide ${index + 1}`}
                />
                {isAdmin && (
                  <div className="absolute top-4 right-4">
                    <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                        <FontAwesomeIcon icon={faUpload} size="lg" />
                      </div>
                    </label>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      onChange={(e) => handleFileChange(e, imageTitles[index])}
                      className="hidden"
                      aria-label="Upload Image"
                    />
                  </div>
                )}
                <div className="text-center mt-4 px-4">
                  <h3 className="text-2xl font-bold">{slide.title}</h3>
                  <p className="text-lg mt-2 text-[#767676]">{slide.description}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;