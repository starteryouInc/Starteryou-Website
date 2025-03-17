import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
// import { toast } from 'react-hot-toast';
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation";

const BestJob2 = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const title = "bestjob2"; // Set the title for fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt

  // States for text content and live counters
  const [titleBJ2, setTitleBJ2] = useState("Best Job 2 Title");
  const [paragraphBJ2, setParagraphBJ2] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing."
  );
  const [titleCounter, setTitleCounter] = useState(5); // Live word counter for title
  const [paragraphCounter, setParagraphCounter] = useState(8); // Live word counter for paragraph
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return; // Prevent fetching again if already attempted

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob(); // Get the response as a Blob
      const url = URL.createObjectURL(blob); // Create a local URL for the Blob
      setUploadedFile(url); // Set the uploaded file data with its local URL
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image"); // Set error message
    } finally {
      setHasFetchedOnce(true); // Mark as fetch attempt made
    }
  };

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData
    formData.append("title", title); // Include the title for the update

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Image updated successfully:", data);

      setUploadedFile(URL.createObjectURL(file)); // Update the uploaded file state with the new image preview
      setError(null); // Reset error state on successful upload
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image"); // Set error message
    }
  };

  const boxes = [
    {
      id: 0,
      iconSrc: "/LandingPage/Icons/page 1.svg",
      title: "Show off your education and skills",
      description: "Get access to opportunities and build your portfolio ",
    },
    {
      id: 1,
      iconSrc: "/LandingPage/Icons/userr.svg",
      title: "Add as much as you can",
      description:
        "Add as much detail as possible to increase your chances of landing the right role.",
    },
  ];

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "BestJob2" },
        }
      );

      setTitleBJ2(data?.content || "");
      setParagraphBJ2(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BestJob2Comp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraphBJ2)
        ? paragraphBJ2
        : [paragraphBJ2.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "BestJob2",
          content: titleBJ2.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BestJob2Comp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occured while saving the content(BestJob2Comp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
    fetchData();
  }, []);

  // Handle text input changes with MaxWords and live counters
  const handleTitleChange = (e) => {
    setTitleBJ2(MaxWords(e.target.value, 5, setTitleCounter));
  };

  const handleParagraphChange = (e) => {
    setParagraphBJ2(MaxWords(e.target.value, 8, setParagraphCounter));
  };

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Image Display Section */}
        <div className="relative order-2 lg:order-1 w-[330px] h-[250px] md:w-[500px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          {/* Main Image */}
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Current Image"
              className="relative w-[340px] h-[180px] top-[35px] left-[30px] md:w-[550px] md:top-[28px] md:left-[50px] lg:top-[78px] lg:left-[70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-6.44deg)" }}
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
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}

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
          {isEditing ? (
            <div className="mt-10 flex flex-col space-y-4 z-50">
              <textarea
                value={titleBJ2}
                onChange={handleTitleChange}
                placeholder="Title here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
              />
              <p className="text-sm text-grey-400">
                {titleCounter} words remaining
              </p>

              <textarea
                value={paragraphBJ2}
                onChange={handleParagraphChange}
                placeholder="Paragraph here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
              />
              <p className="text-sm text-grey-400">
                {paragraphCounter} words remaining
              </p>

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
                {titleBJ2}
              </h2>
              <p className="text-gray-600 mb-2 md:text-lg whitespace-pre-wrap">
                {paragraphBJ2}
              </p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
                />
              )}
            </div>
          )}

          {/* <a href="#" className="text-[#7950F2] hover:underline font-medium">
            Request for demo &gt;
          </a> */}

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
