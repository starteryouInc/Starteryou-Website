import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";

const Blog = () => {
  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState("Our Blog");
  const [paragraph, setParagraph] = useState("Perfectly working Blog");
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const handleEdit = () => isAdmin && setIsEditing(true);

  const [activeLink, setActiveLink] = useState("View All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "Blogs" },
        }
      );

      setTitle(data?.content || "");
      setParagraph(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BlogsComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "Blogs",
          content: title.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BlogsComp Data is saved: ", response);
    } catch (error) {
      console.log("Error occured while saving the content(BlogsComp): ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const links = [
    "View All",
    "Lorem Ipsum",
    "Sed Diam",
    "Consectetur",
    "Euismod",
  ];

  const blogBoxes = [
    {
      img: "/LandingPage/Blogimg1.png",
      title: "Lorem ipsum dolor",
      date: "20 Jan 2023",
      category: "Development",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
    {
      img: "/LandingPage/Blogimg2.png",
      title: "Sed diam nonummy",
      date: "21 Jan 2023",
      category: "Design",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
    {
      img: "/LandingPage/Blogimg1.png",
      title: "Consectetur adipiscing",
      date: "22 Jan 2023",
      category: "Marketing",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
    {
      img: "/LandingPage/Blogimg2.png",
      title: "Lorem ipsum dolor",
      date: "23 Jan 2023",
      category: "Development",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
    {
      img: "/LandingPage/Blogimg1.png",
      title: "Research insights",
      date: "24 Jan 2023",
      category: "Research",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
    {
      img: "/LandingPage/Blogimg2.png",
      title: "Latest trends",
      date: "25 Jan 2023",
      category: "Development",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do.",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogBoxes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === blogBoxes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12 " id="blog">
      <div className="md:flex justify-between items-start">
        {isEditing ? (
          <div className="mt-10 flex flex-col space-y-4 z-50">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title here..."
              className="lg:w-[400px] p-2 bg-transparent border border-black rounded outline-none resize-none text-2xl text-gray-800 scrollbar"
            />
            <textarea
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
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
          <div className="relative md:w-2/3">
            <h2 className="text-3xl font-bold md:text-4xl md:font-extrabold mb-4 text-left">
              {title}
            </h2>
            <p className="text-[#121417] font-normal max-w-[600px] mt-2 italic text-left">
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

        <div className="mt-4 md:mt-0">
          <button className="bg-[#D9502E] text-white py-2 px-4 rounded-lg">
            Show All
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-start sm:space-x-4 space-y-4 sm:space-y-0">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => setActiveLink(link)}
              className={`py-2 px-4 text-sm md:text-base font-medium transition-colors duration-300 ${
                activeLink === link
                  ? "bg-[#D6E4FF] text-blue-700 rounded-lg md:rounded-t-lg md:rounded-b-none"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              {link}
            </button>
          ))}
        </div>
        <hr className="border-t border-gray-300 mt-4 md:mt-0" />
      </div>

      <div className="flex justify-center items-center mt-8 space-x-6">
        {blogBoxes
          .slice(currentIndex, currentIndex + (window.innerWidth < 768 ? 1 : 2))
          .map((box, index) => (
            <div key={index} className="relative w-full md:w-1/2">
              <img
                src={box.img}
                alt="Blog"
                className="w-full h-[300px] md:h-[350px] object-cover mb-4"
              />
              {/* Blur effect container */}
              <div className="absolute inset-0 bg-[#FFFFFF66] backdrop-filter backdrop-blur-[7px] h-[25%] flex items-center justify-between p-4 top-[12.1rem] md:top-[14.9rem]">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base md:text-lg">
                    {box.title}
                  </span>
                  <span className="text-white font-thin text-sm">
                    {box.date}
                  </span>
                </div>
                <span className="text-white font-bold text-base md:text-lg">
                  {box.category}
                </span>
              </div>

              <p className="text-[#767676] mb-4">{box.text}</p>
              <a
                href="#"
                className="text-black font-semibold md:font-extrabold uppercase hover:underline"
              >
                Read Post
                <img
                  src="/LandingPage/Icons/postarrow.svg"
                  alt="icon"
                  className="inline ml-1 w-4 h-4"
                />
              </a>
            </div>
          ))}
      </div>

      <div className="relative flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          className="bg-[#D6E4FF] p-4 rounded-full"
          style={{ width: "50px", height: "50px" }}
        >
          <img
            src="/LandingPage/Icons/Previous_arrow.svg"
            alt="Previous"
            className="w-4 h-4"
          />
        </button>

        <button
          onClick={handleNext}
          className="bg-[#D6E4FF] p-4 rounded-full"
          style={{ width: "50px", height: "50px" }}
        >
          <img
            src="/LandingPage/Icons/Next_arrow.svg"
            alt="Next"
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
};

export default Blog;
