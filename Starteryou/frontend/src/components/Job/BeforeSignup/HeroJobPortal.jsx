import { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { FaPencilAlt } from "react-icons/fa"; // Ensure icon is imported
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";

const HeroJobPortal = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState(
    "Empowering College Students to Discover Job Opportunities"
  );
  const [paragraph, setParagraph] = useState(
    "Starteryou is your go-to platform for college students seeking job listings that match their skills and aspirations. With a user-friendly interface and tailored opportunities, we make job hunting a breeze."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const page = "JobBeforeSignup";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/text", {
          params: { page, component: "HeroJobBefore" },
        });

        if (response.data) {
          setTitle(
            response.data.content ||
              "Empowering College Students to Discover Job Opportunities"
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

      await axios.put("http://localhost:3000/api/text", {
        page: "JobBeforeSignup",
        component: "HeroJobBefore",
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

  return (
    <div className="bg-[#6A54DF] min-h-screen flex flex-col items-center justify-center p-4 md:pt-[100px] pt-[200px] lg:pt-[200px]">
      <div className="text-center max-w-[700px] mx-auto">
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              {title}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white">{paragraph}</p>
            {isAdmin && (
              <FaPencilAlt
                onClick={handleEdit}
                style={{ cursor: "pointer", marginTop: "1rem" }}
                className="text-white"
              />
            )}
          </div>
        )}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-[#D9502E] text-white py-3 px-8 rounded-lg font-semibold">
            Explore
          </button>
          <button className="bg-white text-[#D9502E] py-3 px-8 rounded-lg font-semibold">
            Signup
          </button>
        </div>
      </div>
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Job Opportunities Preview"
            className="relative w-[1500px] lg:h-[800px] md:px-20 lg:mt-10"
          />
        ) : (
          <img
            src="/JobPortalPage/portalHero.svg"
            alt="Job Opportunities"
            className="relative w-[1500px] lg:h-[800px] md:px-20 lg:mt-10"
          />
        )}
        {isAdmin && (
          <div className="absolute right-1 top-0 md:top-14 md:right-20">
            <FileUpload handleFileChange={handleFileChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroJobPortal;
