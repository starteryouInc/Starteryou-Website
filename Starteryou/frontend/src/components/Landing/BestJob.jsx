import { useState, useEffect } from "react";
import FileUpload from "../Common/FileUpload";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";

const BestJob = () => {
  const { isAdmin } = useNavigation();
  const [activeBox, setActiveBox] = useState(0);
  const [image1, setImage1] = useState("/LandingPage/Rectangle.png");
  const [image2, setImage2] = useState("/LandingPage/Heroimg2.jpg");
  const [error, setError] = useState(null); // Error state for handling errors
  //States and Variables for TEXT EDITING API
  const [titleBJ, setTitleBJ] = useState("Best Job Title");
  const [paragraphBJ, setParagraphBJ] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const titles = ["job1", "job2"];
  const boxes = [
    {
      id: 0,
      iconSrc: "/LandingPage/Icons/page 1.svg",
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 1,
      iconSrc: "/LandingPage/Icons/FindJob.svg",
      title: "Find Jobs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 2,
      iconSrc: "/LandingPage/Icons/addJob.svg",
      title: "Add Jobs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];
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
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images"); // Show error toast
      }
    };
    fetchImages();
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

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "BestJob" },
        }
      );

      setTitleBJ(data?.content || "");
      setParagraphBJ(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BestJobComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraphBJ)
        ? paragraphBJ
        : [paragraphBJ.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "BestJob",
          content: titleBJ.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BestJobComp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occured while saving the content(BestJobComp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section */}
        <div className="md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          {isEditing ? (
            <div className="mt-10 flex flex-col space-y-4 z-50">
              <textarea
                value={titleBJ}
                onChange={(e) => setTitleBJ(e.target.value)}
                placeholder="Title here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
              />
              <textarea
                value={paragraphBJ}
                onChange={(e) => setParagraphBJ(e.target.value)}
                placeholder="Paragraph here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
              />
              <div className="lg:w-[400px] flex items-center justify-between space-x-2 text-white">
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
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
                {titleBJ}
              </h2>
              <p className="text-gray-600 mb-2 md:text-lg">{paragraphBJ}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
                />
              )}
            </div>
          )}

          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            See new openings &gt;
          </a>

          {/* Boxes */}
          <div className="mt-8 flex flex-col md:flex-row md:justify-between lg:flex-col md:space-x-2 space-y-4 md:space-y-0 md:px-6 lg:space-x-0 lg:px-0">
            {boxes.map((box) => (
              <div
                key={box.id}
                className={`p-4 rounded-xl cursor-pointer ${
                  activeBox === box.id
                    ? "shadow-[0px_10.19px_30.57px_10.19px_#1F23290A]"
                    : "shadow-none"
                } md:w-[300px] md:h-[200px] lg:h-auto lg:w-auto`}
                onClick={() => setActiveBox(box.id)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={box.iconSrc}
                    alt={box.title}
                    className="w-8 h-8"
                    style={{
                      filter:
                        activeBox === box.id
                          ? "invert(29%) sepia(65%) saturate(7461%) hue-rotate(248deg) brightness(88%) contrast(97%)"
                          : "none",
                    }}
                  />
                  <h3
                    className={`text-xl font-bold ${
                      activeBox === box.id ? "text-[#7950F2]" : "text-black"
                    }`}
                  >
                    {box.title}
                  </h3>
                </div>

                {activeBox === box.id && (
                  <p className="mt-4 text-gray-600 text-lg font-thin text-left">
                    {box.description}
                  </p>
                )}
              </div>
            ))}
          </div>
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
