import { useState, useEffect } from "react"; // Added useEffect import
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import { API_CONFIG } from "@config/api";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { MaxWords } from "../Common/wordValidation";

const BestJob3 = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFile, setUploadedFile] = useState(null); // Use uploadedFile for both uploaded and previewed images
  const title = "bestjob3"; // Set the title for fetching and uploading
  const [error, setError] = useState(null); // Error state for handling errors
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State to track fetch attempt

  // States for text content and live counters
  const [titleBJ3, setTitleBJ3] = useState("Best Job 3");
  const [paragraphBJ3, setParagraphBJ3] = useState([
    "Let us handle the grunt work so you can do the fun stuff.",
    "Lorem Ipsum",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  ]);
  const [titleCounter, setTitleCounter] = useState(5); // Live word counter for title
  const [paragraphCounter1, setParagraphCounter1] = useState(10); // Live word counter for paragraph 1
  const [paragraphCounter2, setParagraphCounter2] = useState(10); // Live word counter for paragraph 2
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

  useEffect(() => {
    fetchUploadedFile(); // Fetch the specific image on component mount
  }, []);

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

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "BestJob3" },
        }
      );

      setTitleBJ3(data?.content || "");
      setParagraphBJ3(data?.paragraphs || []);
    } catch (error) {
      console.error("Error fetching textData of BestJob3Comp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraphBJ3)
        ? paragraphBJ3
        : [paragraphBJ3.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "BestJob3",
          content: titleBJ3.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BestJob3Comp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occurred while saving the content (BestJob3Comp): ",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:mb-10">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section */}
        <div className="md:w-full lg:w-1/2 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          {isEditing ? (
            <div className="mt-10 flex flex-col space-y-4 z-50">
              <textarea
                value={titleBJ3}
                onChange={(e) => setTitleBJ3(MaxWords(e.target.value, 5, setTitleCounter))}
                placeholder="Title here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
              />
              <p className="text-sm text-white">{titleCounter} words remaining</p>

              <textarea
                value={paragraphBJ3[0]}
                onChange={(e) => {
                  setParagraphBJ3((prev) => {
                    const updatedParagraphs = [...prev];
                    updatedParagraphs[0] = MaxWords(
                      e.target.value,
                      10,
                      setParagraphCounter1
                    );
                    return updatedParagraphs;
                  });
                }}
                placeholder="Paragraph here..."
                className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
              />
              <p className="text-sm text-grey-400">{paragraphCounter1} words remaining</p>
            </div>
          ) : (
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
                {titleBJ3}
              </h2>
              <p className="text-gray-600 mb-2 md:text-lg font-light whitespace-pre-wrap">
                {paragraphBJ3[0]}
              </p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  className="cursor-pointer absolute top-0 -right-2 lg:-right-5"
                />
              )}
            </div>
          )}

          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            Request for demo &gt;
          </a>

          {/* Box */}
          {isEditing ? (
            <div className="mt-8 flex items-start space-x-4 p-4 rounded-xl shadow-[0px_10.19px_30.57px_10.19px_#1F23290A] md:w-[600px] md:mx-auto lg:h-auto lg:mx-0 lg:max-w-[500px]">
              <img
                src="/LandingPage/Icons/pen.png"
                alt=""
                className="w-8 h-8"
              />
              <div>
                <textarea
                  value={paragraphBJ3[1]}
                  onChange={(e) => {
                    setParagraphBJ3((prev) => {
                      const updatedParagraphs = [...prev];
                      updatedParagraphs[1] = MaxWords(
                        e.target.value,
                        10,
                        setParagraphCounter2
                      );
                      return updatedParagraphs;
                    });
                  }}
                  placeholder="Title here..."
                  className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
                />
                <p className="text-sm text-grey-400">{paragraphCounter2} words remaining</p>

                <textarea
                  value={paragraphBJ3[2]}
                  onChange={(e) => {
                    setParagraphBJ3((prev) => {
                      const updatedParagraphs = [...prev];
                      updatedParagraphs[2] = e.target.value;
                      return updatedParagraphs;
                    });
                  }}
                  placeholder="Description here..."
                  className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-xl text-gray-800 scrollbar"
                />
                <p className="text-sm text-grey-400">{paragraphCounter2} words remaining</p>

              </div>
            </div>
          ) : (
            <div className="mt-8 p-4 rounded-xl shadow-[0px_10.19px_30.57px_10.19px_#1F23290A] md:w-[600px] md:mx-auto lg:h-auto lg:mx-0 lg:max-w-[500px]">
              <div className="flex items-center space-x-4">
                <img
                  src="/LandingPage/Icons/pen.png"
                  alt=""
                  className="w-8 h-8"
                />
                <h3 className="text-xl font-bold text-[#7950F2] whitespace-pre-wrap">
                  {paragraphBJ3[1]}
                </h3>
              </div>
              <p className="mt-4 text-[#646A73] text-base font-light text-left whitespace-pre-wrap">
                {paragraphBJ3[2]}
              </p>
            </div>
          )}
          {isEditing && (
            <div className="mt-10 flex items-center justify-between space-x-2 text-white">
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
          )}
        </div>

        {/* Right Section */}
        <div className="relative w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Preview"
              className="relative w-[340px] h-[190px] top-[66px] left-[-48px] md:w-[480px] md:h-[200px] md:top-[71px] md:left-[-20px] lg:top-[78px] lg:left-[-70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-10.22deg)" }}
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Job Opportunities"
              className="relative w-[340px] h-[190px] top-[66px] left-[-48px] md:w-[480px] md:h-[200px] md:top-[71px] md:left-[-20px] lg:top-[78px] lg:left-[-70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-10.22deg)" }}
            />
          )}
          {/* Admin file upload section */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
    </div>
  );
};

export default BestJob3;
