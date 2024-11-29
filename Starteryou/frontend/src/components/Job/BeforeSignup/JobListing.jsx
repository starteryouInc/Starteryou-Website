import { useEffect, useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";
import axios from "axios"; // Ensure axios is imported
import { FaPencilAlt } from "react-icons/fa"; // Ensure icon is imported
import { API_CONFIG } from "@config/api";
const JobListing = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState(
    "Discover Job Listings Curated Specifically for College Students"
  );
  const [paragraph, setParagraph] = useState(
    " At Starteryou, we understand the unique needs of college students seeking job opportunities. Our platform offers a tailored selection of job listings designed to help you kickstart your career."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "JobListing" },
          }
        );

        if (response.data) {
          setTitle(
            response.data.content ||
              "Discover Job Listings Curated Specifically for College Students"
          );
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch {
        console.error("Error fetching data");
        setError("Error fetching content. Please try again later.");
      }
    };

    fetchData();
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  const handleEdit = () => isAdmin && setIsEditing(true);

  const handleChangeTitle = (e) => setTitle(e.target.value);

  const handleChangeParagraph = (e) => setParagraph(e.target.value);
  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "JobBeforeSignup",
        component: "JobListing",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError("");
      setIsEditing(false);
    } catch {
      console.error("Error saving content");
      setError("Error saving content. Please try again later.");
    }
  };
  const jobInfo = [
    {
      id: 1,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Find jobs that fit your schedule and skills.",
    },
    {
      id: 2,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Access opportunities from top employers in your area.",
    },
    {
      id: 3,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Start your journey towards a successful career today!",
    },
  ];

  return (
    <div className=" mx-auto max-w-[1430px]  px-4 lg:px-10 py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={handleChangeTitle}
                className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] border border-gray-300 p-2 rounded w-full"
              />
              <textarea
                value={paragraph}
                onChange={handleChangeParagraph}
                className="text-[#1F2329] text-base border border-gray-300 p-2 rounded w-full"
                rows={6}
              />
              <button
                onClick={saveContent}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black">
                {title}
              </h2>
              <p className="text-black text-base max-w-[470px]">{paragraph}</p>
              {isAdmin && (
                <FaPencilAlt
                  onClick={handleEdit}
                  style={{ cursor: "pointer", marginTop: "1rem" }}
                  className="text-black"
                />
              )}
            </div>
          )}
          {/* Image and Text Columns */}
          <div className="mt-6 space-y-4">
            {jobInfo.map((info) => (
              <div key={info.id} className="flex items-center space-x-2">
                <img
                  src={info.imageSrc}
                  alt={`Icon ${info.id}`}
                  className="w-6 h-6"
                />
                <p className="text-black text-base">{info.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden flex justify-center md:items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl left-[30px] top-[30px] md:left-[58px] md:top-[80px]"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Job Opportunities"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl left-[30px] top-[30px] md:left-[58px] md:top-[80px]"
              style={{ transform: "rotate(-6.44deg)" }}
            />
          )}
          {/* Admin file upload section */}
          {isAdmin && (
            <div className=" absolute top-0 right-2 ">
              {" "}
              <FileUpload handleFileChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
