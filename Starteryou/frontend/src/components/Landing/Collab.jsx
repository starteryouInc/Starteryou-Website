import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const Collab = () => {
  const { isAdmin } = useNavigation();
  const [uploadedImages, setUploadedImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const imageTitles = ["collab1", "collab2", "collab3", "collab4", "collab5"]; // Titles for backend

  // Fetch images from the backend
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
      setUploadedImages(fetchedImages);
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

  // Handle image upload
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

      const updatedImages = [...uploadedImages];
      updatedImages[index] = URL.createObjectURL(file);
      setUploadedImages(updatedImages);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Error uploading image: ${imageType}`);
    }
  };

  return (
    <div className="px-4">
      <div className="relative bg-[#E9F0FF] py-10 lg:my-4 max-w-[1300px] mx-auto rounded-xl overflow-hidden px-6">
        {/* Circle Decorations */}
        <div className="absolute top-[-89px] left-[-36px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />
        <div className="absolute bottom-[-100px] right-[-27px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <p className="text-base text-gray-600">Trusted By 20,000 students</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-2">
            They Trust Us
          </h2>
          <hr className="border-[#C0C0C0] border-[1.27px] w-full max-w-[1200px] mx-auto mt-6" />
        </div>

        {/* Images */}
        <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1200px] mx-auto">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image || "https://via.placeholder.com/150X80"}
                alt={`Image ${index + 1}`}
                className="w-full rounded-lg px-2"
              />
              {isAdmin && (
                <div className="absolute top-2 right-2">
                  <label
                    htmlFor={`file-upload-${index}`}
                    className="cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                      <FontAwesomeIcon icon={faUpload} size="sm" />
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
          ))}
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Collab;
