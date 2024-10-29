import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
const OurMission = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div className="max-w-[1300px] mx-auto container px-4 pt-4">
      <div className="flex flex-col md:flex-row md:space-x-4 items-center">
        {/* Text Box */}
        <div className="bg-white p-2 md:p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329]">
              OUR MISSION
            </h2>
            <p className="text-[#1F2329] text-base">
              Starteryou is dedicated to empowering students by providing a
              vibrant and inclusive platform for discovering career
              opportunities. We foster a supportive community that bridges the
              gap between students and employers, facilitating skill development
              and guiding them towards meaningful career paths. We aim to
              transform the student learning experience, equipping individuals
              with essential career skills often overlooked in traditional
              education settings. We&apos;re committed to providing the tools
              and opportunities necessary for students to succeed in their
              future careers. Our commitment to innovation, affordability, and
              collaboration ensures that every student can confidently navigate
              their way to valuable work experiences year-round.
            </p>
          </div>
        </div>

        {/* Image Box */}

        <div className="relative md:flex-1 w-full bg-cover bg-center rounded-lg mb-4 md:mb-0 h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px] ">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className=" relative h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          ) : (
            <img
              src="/JobPortalPage/Placeholder Image.png"
              alt="placeholder"
              className=" relative h-[250px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          )}
          {/* Admin file upload section */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
    </div>
  );
};

export default OurMission;
