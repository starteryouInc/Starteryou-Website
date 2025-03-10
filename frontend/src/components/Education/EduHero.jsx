import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
import Navbar from "../Common/Navbar";

const EduHero = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div>
      <Navbar isEduHero={true} />
      <div className=" min-h-screen flex flex-col items-center justify-center p-4 md:pt-[100px] pt-[200px] lg:pt-[200px] mb-12">
        <div className="text-center max-w-[700px] mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Discover Your Future with Starteryou
          </h1>
          <p className="text-lg md:text-xl mb-6 text-black">
            Welcome to Starteryou, your gateway to a world of educational
            opportunities. Explore a diverse range of courses from top schools
            and take the next step towards your career goals.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <button className="bg-black text-white py-3 px-8  font-semibold">
              Explore
            </button>
            <button className="bg-white text-black border border-black py-3 px-8  font-semibold">
              Sign Up
            </button>
          </div>
        </div>
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt=" Job Opportunities Preview"
              className="relative w-[1500px] lg:h-[800px] md:px-20 lg:mt-10"
            />
          ) : (
            <img
              src="/JobPortalPage/Placeholder Image.png"
              alt="Job Opportunities"
              className="relative w-[1500px] lg:h-[800px] md:px-20 lg:mt-10"
            />
          )}
          {/* Admin file upload section */}
          {isAdmin && (
            <div className=" absolute right-1 top-0 md:top-14 md:right-20 ">
              {" "}
              <FileUpload handleFileChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EduHero.metadata = {
  componentName: "EduHero",
  description:
    "A component that serves as the hero section for the Starteryou platform, featuring a welcoming message, a call to action, and an optional file upload section for admins.",
  features: {
    fileUpload: true, // Admin file upload feature
    previewImage: true, // Image preview feature
    navigation: true, // Navigation context integration
  },
  accessibility: {
    headings: [
      {
        level: 1,
        text: "Discover Your Future with Starteryou",
      },
      {
        level: 2,
        text: "Welcome to Starteryou, your gateway to a world of educational opportunities.",
      },
    ],
    buttons: {
      text: ["Explore", "Sign Up"],
    },
  },
  styles: {
    container: {
      minHeight: "100vh",
      padding: "20px",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "black",
    },
    description: {
      fontSize: "1.125rem",
      color: "black",
    },
    button: {
      padding: "12px 32px",
      fontWeight: "600",
    },
    image: {
      width: "1500px",
      height: "800px",
    },
  },
  content: {
    previewImage: {
      default: "/JobPortalPage/Placeholder Image.png",
      altText: "Job Opportunities",
    },
  },
};
export default EduHero;
