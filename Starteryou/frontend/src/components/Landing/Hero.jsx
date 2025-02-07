import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation"; // Import MaxWords function

const Hero = () => {
  const { isAdmin } = useNavigation();
  const [error, setError] = useState(null); // Error state for handling errors

  // State variables for each image
  const [image1, setImage1] = useState("/LandingPage/Heroimg3.png");
  const [image2, setImage2] = useState("/LandingPage/Heroimg2.jpg");
  const [image3, setImage3] = useState("/LandingPage/Heroimg3.png");

  // States and Variables for TEXT EDITING API
  const [title, setTitle] = useState("Collaborate Together");
  const [paragraph, setParagraph] = useState("Perfectly working Hero");
  const [titleCounter, setTitleCounter] = useState(3); // Counter for remaining words in title
  const [paragraphCounter, setParagraphCounter] = useState(11); // Counter for remaining words in paragraph
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  // Titles to identify each image in the backend
  const titles = ["hero1", "hero2", "hero3"]; // Different titles for each image

  // Fetch images by title on component mount
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
        toast.error("Failed to load images"); // Show error toast
      }
    };
    fetchImages();
  }, []);

  // Handle image update by title
  const handleImageUpload = async (event, imageType) => {
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
      } else if (imageType === "image3") {
        setImage3(URL.createObjectURL(file));
      }

      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error(`Error updating image for ${imageType}:`, error);
      setError(`Error updating image for ${imageType}`); // Set error message
    }
  };

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "Hero" },
        }
      );

      setTitle(data?.content || "Your Hero Title Here");
      setParagraph(
        Array.isArray(data?.paragraphs)
          ? data.paragraphs.join("\n")
          : "Your description paragraph here."
      );
    } catch (error) {
      console.error("Error fetching textData of HeroComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "Hero",
          content: title.trim(),
          paragraphs: normalizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("HeroComp Data is saved: ", response);
    } catch (error) {

      console.log("Error occurred while saving the content(HeroComp): ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update title and paragraph handlers
  const handleTitleChange = (e) => {
    setTitle(MaxWords(e.target.value, 3, setTitleCounter));
  };

  const handleParagraphChange = (e) => {
    setParagraph(MaxWords(e.target.value, 11, setParagraphCounter));
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

      {isEditing ? (
        <div className="mt-10 lg:mt-40 flex flex-col items-center space-y-4 z-10">
          <textarea
            value={title}
            onChange={handleTitleChange}
            placeholder="Title here..."
            className="lg:w-[400px] p-2 bg-transparent border border-white rounded outline-none resize-none text-2xl text-gray-200 scrollbar"
          />
          <p className="text-sm text-white">{titleCounter} words remaining</p>
          <textarea
            value={paragraph}
            onChange={handleParagraphChange}
            placeholder="Paragraph here..."
            className="lg:w-[700px] p-2 bg-transparent border border-white rounded outline-none resize-none text-xl text-gray-200 scrollbar"
          />
          <p className="text-sm text-white">{paragraphCounter} words remaining</p>
          <div className="lg:w-[400px] flex items-center justify-between space-x-2">
            <button
              onClick={saveContent}
              className="bg-green-600 py-2 px-4 rounded text-xl w-1/2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-600 py-2 px-4 rounded text-xl w-1/2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mt-[120px] lg:mt-[190px] flex flex-col items-center z-10">
          <h1 className="font-bold text-[40px] sm:text-[64px] leading-tight text-black uppercase">
            {title}
          </h1>
          <p className="font-normal text-[16px] sm:text-[28px] mt-6 max-w-5xl whitespace-pre-wrap">
            {paragraph}
          </p>
          {isAdmin && (
            <FaPencilAlt
              onClick={handleEdit}
              className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
            />
          )}
        </div>
      )}
      
      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 z-10">
        <button className="bg-white text-[#D9502E] font-bold px-8 py-4 rounded-md text-lg">
          Try for free
        </button>
        <button className="bg-[#D9502E] text-white font-bold px-8 py-4 rounded-md text-lg">
          Get Demo
        </button>
      </div>

      {/* doodle1 */}
      <div className="absolute z-20 w-[80px] h-[80px] top-[140px] left-[0px] md:w-[212px] md:h-[157px] md:top-[150px] md:left-[8px] lg:left-[195px]">
        <img
          src="/LandingPage/4 1.png"
          alt="Doodle 1"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* doodle2 */}
      <div className="absolute z-10 w-[100px] h-[100px] md:w-[150px] md:h-[150px] top-[236px] left-[280px] lg:w-[275px] lg:h-[242px] lg:top-[110px] md:top-[240px] md:left-[570px] lg:left-[1180px] opacity-90">
        <img
          src="/LandingPage/hat.png"
          alt="Doodle 2"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* doodle3 */}
      <div className="absolute z-10 hidden md:block lg:w-[241px] lg:h-[243px] lg:top-[400px] lg:left-[60px] md:w-[100px] md:h-[150px] md:top-[580px] md:left-[23px]">
        <img
          src="/LandingPage/doodle-4 1.png"
          alt="Doodle 3"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* doodle4 */}
      <div className="absolute z-10 w-[80px] h-[80px] top-[583px] left-[35px] md:w-[119px] md:h-[138px] lg:top-[420px] lg:left-[450px] md:top-[555px] md:left-[140px]">
        <img
          src="/LandingPage/obj2.png"
          alt="Doodle 4"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Image Section */}
      <div className="relative mt-20 flex justify-center items-center w-full">
        {/* Left Image with File Upload */}
        <div className="absolute left-[22px] z-5 pt-20 w-[500px] h-[300px] md:w-[300px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
          <img
            src={image1}
            alt="Left Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
          {isAdmin && (
            <div className="hidden md:block absolute top-20 left-20">
              <FileUpload
                handleFileChange={(e) => handleImageUpload(e, titles[0])}
              />
            </div>
          )}
        </div>

        {/* Central Image */}
        <div className="relative overflow-hidden z-10 w-full h-[300px] sm:w-[400px] md:w-[500px] md:h-[400px] lg:w-[900px] lg:h-[500px]">
          <img
            src={image2}
            alt="Central Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
          {isAdmin && (
            <div>
              <FileUpload
                handleFileChange={(e) => handleImageUpload(e, titles[1])}
              />
            </div>
          )}
        </div>

        {/* Right Image with File Upload */}
        <div className="absolute right-[22px] z-5 pt-20 w-[500px] h-[300px] md:w-[300px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
          <img
            src={image3}
            alt="Right Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
          {isAdmin && (
            <div className="hidden md:block absolute top-20 right-2">
              <FileUpload
                handleFileChange={(e) => handleImageUpload(e, titles[2])}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
