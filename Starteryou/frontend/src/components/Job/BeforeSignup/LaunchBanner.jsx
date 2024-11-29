import { useState } from "react";
import { useNavigation } from "../../../context/NavigationContext";
import FileUpload from "../../Common/FileUpload";

const LaunchBanner = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div className="flex flex-col md:flex-row  md:max-w-[1400px] md:mx-auto p-3 md:p-8 my-16 md:my-20">
      {/* Text Section */}
      <div className="flex flex-col justify-center md:w-1/2 p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Launch Your Career Journey
        </h1>
        <p className="text-gray-700 mb-4 ">
          Join our platform and discover exciting job opportunities tailored for
          college <br /> students like you!
        </p>
        <div className="flex space-x-4">
          <button className="bg-[#D9520E] text-white py-2 px-4 rounded-xl">
            Sign Up
          </button>
          <button className="bg-white border border-black text-black py-2 px-4 ">
            Learn More
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 p-4 relative">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className=" w-[700px] h-[370px] object-cover "
          />
        ) : (
          <img
            src="/JobPortalPage/Placeholder Image.png"
            alt="Career Launch"
            className=" w-[700px] h-[270px] md:h-[370px] object-cover "
          />
        )}
        {/* Admin file upload section */}
        {isAdmin && (
          <div className="absolute top-3 right-4 ">
            {" "}
            <FileUpload handleFileChange={handleFileChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchBanner;
