import { useEffect, useState } from "react";
import FileUpload from "../../Common/FileUpload";
import { useNavigation } from "../../../context/NavigationContext";
import { API_CONFIG } from "@config/api";

const LatestInsight = () => {
  const { isAdmin } = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const title = ["blog1", "blog2", "blog3"];
  const insights = [
    {
      id: 1,
      type: "Job Hunting",
      time: "5 min read",
      title:
        "Portfolio:A Step-by-Step Guider to Crafting an Outstanding High School Portfolio",
      description:
        "Crafting an Outstanding High School Portfolio: A Step-by-Step Guide.",
      link: "/read-more-1",
    },
    {
      id: 2,
      type: "Job Applications",
      time: "5 min read",
      title:
        "The Ultimate Guide for High School Students! to Applying for and Getting into College",
      description:
        "Applying for and Getting into College: The Ultimate Guide for High School Students!",
      link: "/read-more-2",
    },
    {
      id: 3,
      type: "Career Insights",
      time: "5 min read",
      title: "Kickstart Your Career: The Ultimate Guide to Entry-Level Jobs",
      description:
        "Learn how to secure entry-level jobs by getting tips on resume writing, experience building, and interview prep",
      link: "/read-more-3",
    },
  ];
  const fetchUploadedImages = async () => {
    if (hasFetchedOnce) return;

    try {
      const fetchedImages = await Promise.all(
        title.map(async (title) => {
          const response = await fetch(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
          );
          if (!response.ok) throw new Error(`Failed to fetch image: ${title}`);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        })
      );
      setUploadedFiles(fetchedImages);
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
  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title[index]);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title[index])}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok)
        throw new Error(`Failed to upload image: ${title[index]}`);

      const updatedFiles = [...uploadedFiles];
      updatedFiles[index] = URL.createObjectURL(file);
      setUploadedFiles(updatedFiles);
      setError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Error uploading image: ${title[index]}`);
    }
  };

  return (
    <section className="py-16 bg-[#FAF6FE]">
      <div className="text-center">
        <h1 className="text-md font-semibold text-black">Blog</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-black mt-3 ">
          Latest Insights for Students
        </h2>
        <p className="mt-2 text-black">
          Stay updated with our latest blog posts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-7xl mx-auto px-3">
        {insights.map(({ id, type, time, title, description, link }) => (
          <div
            key={id}
            className="bg-[#FAF6FE] border border-black overflow-hidden"
          >
            <img
              src={uploadedFiles[id - 1]}
              alt={title}
              className="w-full h-48 object-cover relative"
            />
            {isAdmin && (
              <div className="relative top-0 right-2 ">
                <FileUpload
                  handleFileChange={(e) => handleFileChange(e, id - 1)}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex gap-4  items-center text-sm text-black mb-4">
                <div className="bg-[#EEEEEE] py-1 px-2">
                  <span className="font-semibold">{type}</span>
                </div>
                <span className="font-semibold">{time}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
              <a href={link} className="text-black hover:underline">
                Read more &gt;
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 md:mt-20 flex justify-center">
        {/* <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
          View all
        </button> */}
      </div>
    </section>
  );
};

LatestInsight.metadata = {
  componentName: "LatestInsight",
  description:
    "A component displaying the latest blog insights for students, with support for admin file uploads.",
  features: {
    adminFileUpload: true, // Allows admins to upload images for blog posts
    responsiveDesign: true, // Adapts layout for different screen sizes
    errorHandling: true, // Displays error messages for image fetch and upload failures
    dynamicImageLoading: true, // Loads images dynamically from the API
  },
  data: {
    title: ["blog1", "blog2", "blog3"], // Titles for uploaded images
    insights: [
      {
        id: 1,
        type: "Job Hunting",
        time: "5 min read",
        title:
          "Portfolio: A Step-by-Step Guide to Crafting an Outstanding High School Portfolio",
        description:
          "Crafting an Outstanding High School Portfolio: A Step-by-Step Guide.",
        link: "/read-more-1",
      },
      {
        id: 2,
        type: "Job Applications",
        time: "5 min read",
        title:
          "The Ultimate Guide for High School Students to Applying for and Getting into College",
        description:
          "Applying for and Getting into College: The Ultimate Guide for High School Students!",
        link: "/read-more-2",
      },
      {
        id: 3,
        type: "Career Insights",
        time: "5 min read",
        title: "Budgeting Tips for Students",
        description:
          "Learn how to manage your finances effectively as a student.",
        link: "/read-more-3",
      },
    ],
  },
  accessibility: {
    fileUpload: "Admin users can upload new images for each blog post.",
    readMoreLinks: "Navigate to read more for each blog post.",
  },
  styles: {
    section: {
      paddingY: "4rem", // Vertical padding for the section
      backgroundColor: "#FAF6FE", // Background color for the section
    },
    title: {
      textAlign: "center", // Center alignment for the section title
      fontSize: "3rem", // Font size for the main title
      marginTop: "1rem", // Margin above the title
    },
    blogPost: {
      border: "1px solid black", // Border style for blog post containers
      overflow: "hidden", // Prevent overflow of content
    },
    img: {
      width: "100%", // Full width for images
      height: "12rem", // Fixed height for images
      objectFit: "cover", // Cover style for image fitting
    },
    button: {
      backgroundColor: "#D9520E", // Background color for buttons
      color: "white", // Text color for buttons
      padding: "0.5rem 1rem", // Padding for buttons
      borderRadius: "0.375rem", // Rounded corners for buttons
      hover: {
        backgroundColor: "#A83D0A", // Darker shade on hover
      },
    },
  },
};
export default LatestInsight;
