/**
 * @module Hero
 * @description A React component that displays a hero section with multiple manageable images
 */

import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";

/**
 * @typedef {Object} ImageData
 * @property {string} title - Title of the image
 * @property {string} url - URL of the image
 */

/**
 * Hero component
 * @returns {JSX.Element} Rendered hero section
 */
const Hero = () => {
  const { isAdmin } = useNavigation();

  /**
   * @type {string}
   */
  const [image1, setImage1] = useState("/LandingPage/Heroimg3.png");

  /**
   * @type {string}
   */
  const [image2, setImage2] = useState("/LandingPage/Heroimg2.jpg");

  /**
   * @type {string}
   */
  const [image3, setImage3] = useState("/LandingPage/Heroimg3.png");

  /**
   * @type {Array<string>}
   */
  const titles = ["starteryou-v2", "starteryou-v2", "starteryou-v2"];

  /**
   * Fetches all images from the server
   * @async
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const responses = await Promise.all(
          titles.map(async (title) => {
            const response = await fetch(
              `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle(title)}`
            );
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          })
        );
        setImage1(responses[0]);
        setImage2(responses[1]);
        setImage3(responses[2]);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      }
    };
    fetchImages();
  }, []);

  /**
   * Handles image upload for a specific image slot
   * @async
   * @param {Event} e - File input change event
   * @param {Function} setImage - State setter function for the target image
   * @param {string} title - Title identifier for the image
   */
  const handleImageUpload = async (e, setImage, title) => {
    const file = e.target.files[0];
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
      if (!response.ok) throw new Error("Network response was not ok");

      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);
      toast.success(`Image updated successfully for ${title}`);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error(`Error updating image for ${title}`);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#2700D3] flex flex-col justify-center items-center text-center text-white px-4 overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute z-0"
        style={{
          width: "807px",
          height: "700px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#E5F1FF",
          filter: "blur(100px)",
          opacity: "0.8",
        }}
      ></div>

      {/* Main Background overlay */}
      <div className="absolute inset-0 top-0 w-full h-full bg-[radial-gradient(circle_farthest-side_at_50%_-150%,_rgba(229,241,255,1),_#2700D3),linear-gradient(to_bottom,_#2700D3,_rgba(229,241,255,1))] opacity-80 z-1"></div>

      {/* Content Section */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-4">Collaborate Together</h1>
        <p className="text-xl mb-8">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit...
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded">
            Try for free
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Get Demo
          </button>
        </div>

        {/* Image Section */}
        <div className="relative mt-16">
          <div className="flex justify-center space-x-8">
            <div className="w-1/3">
              <img
                src={image1}
                alt="Feature 1"
                className="w-full h-64 object-cover rounded"
              />
              {isAdmin && (
                <FileUpload
                  handleFileChange={(e) => handleImageUpload(e, setImage1, titles[0])}
                />
              )}
            </div>
            <div className="w-1/3">
              <img
                src={image2}
                alt="Feature 2"
                className="w-full h-64 object-cover rounded"
              />
              {isAdmin && (
                <FileUpload
                  handleFileChange={(e) => handleImageUpload(e, setImage2, titles[1])}
                />
              )}
            </div>
            <div className="w-1/3">
              <img
                src={image3}
                alt="Feature 3"
                className="w-full h-64 object-cover rounded"
              />
              {isAdmin && (
                <FileUpload
                  handleFileChange={(e) => handleImageUpload(e, setImage3, titles[2])}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;