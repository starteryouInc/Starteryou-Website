import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../FileUpload";

const AppSupport = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };

  return (
    <div className=" mx-auto max-w-[1430px]  px-4 md:px-2 lg:px-4  py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6 lg:gap-24 gap-7">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center md:order-2  ">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black max-w-[500px]">
            Unlock Your Potential with Expert Application Support!
          </h2>
          <p className="text-black text-base max-w-[470px]">
            At Starteryou, we provide essential resources to help you shine in
            your job applications. From resume writing tips to interview
            preparation, we’ve got you covered.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-3">
            <div className="max-w-[300px]">
              <p className="font-semibold mb-2 ">Resume Writing</p>
              <p>
                Craft a standout resume that highlights your unique skills and
                experiences.
              </p>
            </div>
            <div className="max-w-[300px]">
              <p className="font-semibold mb-2">Interview Prep</p>
              <p>
                Master the art of interviewing with our expert tips and practice
                resources.
              </p>
            </div>
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

export default AppSupport;
