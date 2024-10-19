import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../FileUpload";
const icons = [
  {
    src: "/LandingPage/Icons/dashboard.svg",
    alt: "Dashboard Icon",
    text: "Home Page",
    link: "/dashboard",
  },
  {
    src: "/LandingPage/Icons/social.svg",
    alt: "Settings Icon",
    text: "School Magazines",
    link: "/teams-socials",
  },
  {
    src: "/LandingPage/Icons/user-square.svg",
    alt: "User Icon",
    text: "XXXXXXXXXXXX",
    link: "/job-profile",
  },
  {
    src: "/LandingPage/Icons/subscribe.svg",
    alt: "Analytics Icon",
    text: "XXXXXXXXXXXX",
    link: "/subscription-management",
  },
];

const BestJob4 = () => {
  const [activeIcon, setActiveIcon] = useState(0);
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div className="flex items-center justify-center py-16 lg:mt-20 px-4 lg:px-0">
      <div className="max-w-[1200px] h-auto w-full text-center">
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold lg:font-extrabold text-[#1F2329] mb-6">
          Lorem ipsum dolor sit amet
        </p>
        <div className="flex flex-col items-center mt-10">
          {/* Icons for small screens */}
          <div className="flex flex-col items-center space-y-4 sm:hidden">
            <div className="flex flex-wrap justify-center space-x-6">
              {icons.map(({ src, alt, text, link }, index) => (
                <a
                  href={link}
                  key={index}
                  className={`flex items-center mb-4 relative ${
                    activeIcon === index ? "text-[#7950F2]" : "text-[#1F2329]"
                  }`}
                  onClick={() => setActiveIcon(index)}
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-8 h-8"
                    style={{
                      filter:
                        activeIcon === index
                          ? "invert(29%) sepia(65%) saturate(7461%) hue-rotate(248deg) brightness(88%) contrast(97%)"
                          : "none",
                    }}
                  />
                  <span
                    className={`ml-2 text-[9px] sm:text-sm italic font-light ${
                      activeIcon === index ? "text-[#7950F2]" : "text-[#1F2329]"
                    }`}
                  >
                    {text}
                  </span>
                  {activeIcon === index && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#7950F2]" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Icons for medium and large screens */}
          <div className="hidden sm:flex flex-wrap justify-center space-x-6">
            {icons.map(({ src, alt, text }, index) => (
              <div
                key={index}
                className={`flex items-center mb-4 relative cursor-pointer ${
                  activeIcon === index ? "text-[#7950F2]" : "text-[#1F2329]"
                }`}
                onClick={() => setActiveIcon(index)}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-[20px] h-[20px] md:w-[20px] md:h-[20px]"
                  style={{
                    filter:
                      activeIcon === index
                        ? "invert(29%) sepia(65%) saturate(7461%) hue-rotate(248deg) brightness(88%) contrast(97%)"
                        : "none",
                  }}
                />
                <span
                  className={`ml-2 text-[9px] sm:text-sm italic ${
                    activeIcon === index ? "text-[#7950F2]" : "text-[#1F2329]"
                  }`}
                >
                  {text}
                </span>
                {activeIcon === index && (
                  <div className="absolute bottom-[-6px] left-0 w-full h-[1.5px] bg-[#7950F2]" />
                )}
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="w-[330px] h-[250px] md:w-[550px] lg:w-[1020px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-t-2xl rounded-b-none overflow-hidden relative flex items-center justify-center lg:mt-5">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="relative w-[235px] h-[220px] top-[25px] md:w-[380px] md:h-[200px] lg:w-[900px] lg:h-[460px] lg:top-[50px] object-cover rounded-t-2xl rounded-b-none"
              />
            ) : (
              <img
                src="/LandingPage/Rectangle.png"
                alt="img"
                className="relative w-[235px] h-[220px] top-[25px] md:w-[380px] md:h-[200px] lg:w-[900px] lg:h-[460px] lg:top-[50px] object-cover rounded-t-2xl rounded-b-none"
              />
            )}
            {/* Admin file upload section */}
            {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestJob4;
