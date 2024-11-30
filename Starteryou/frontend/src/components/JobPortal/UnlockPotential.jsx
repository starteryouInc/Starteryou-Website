import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";

const UnlockPotential = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div className="max-w-[1430px] mx-auto px-4 lg:px-10 py-7 md:py-20 ">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white p-2 flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black lg:max-w-[500px]">
            Unlock Your Potential with Starteryou: Your Path to Career Success
          </h2>
          <p className="text-black text-base max-w-[470px]">
            Starteryou offers students the chance to gain valuable work
            experience while balancing their studies. With flexible job
            opportunities tailored to your schedule, you can enhance your resume
            and prepare for a successful career.
          </p>
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
              alt="Unlock Potential"
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

export default UnlockPotential;
