import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../FileUpload";

const IdealJob = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };

  return (
    <div className=" mx-auto max-w-[1430px]  px-4 md:px-0 lg:px-4  py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6 lg:gap-24 gap-7">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center md:order-2  ">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black max-w-[500px]">
            Find Your Ideal Job with Advanced Filters
          </h2>
          <p className="text-black text-base max-w-[470px]">
            With Starteryou&apos;s advanced search filters, you can easily
            narrow down job listings based on your preferences. Whether
            you&apos;re looking by industry, location, or job type, we make it
            simple to find the right opportunity for you.
          </p>

          {/* Buttons */}
          <div className="mt-10 ">
            <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
              Search
            </button>
            <button className="text-black px-4 py-2 rounded-lg  items-center">
              Explore
              <span className="ml-2">{">"}</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden flex justify-center md:items-center md:order-1 ">
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

export default IdealJob;
