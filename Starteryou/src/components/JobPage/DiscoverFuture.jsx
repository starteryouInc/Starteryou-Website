import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../FileUpload";

const DiscoverFuture = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  const jobInfo = [
    {
      id: 1,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Gain insights into company culture and values..",
    },
    {
      id: 2,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Read authentic employee reviews and experiences.",
    },
    {
      id: 3,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Find the right fit for your career.",
    },
  ];
  return (
    <div className=" mx-auto max-w-[1430px]  px-4 lg:px-10 py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center">
          <p className="mb-2">Explore</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black max-w-[500px]">
            Discover Your Future with Top Employers
          </h2>
          <p className="text-black text-base max-w-[470px]">
            At Starteryou, we provide in-depth profiles of potential employers,
            showcasing their culture, values, and employee experiences. This
            empowers you to make informed decisions about where to apply.
          </p>
          {/* Image and Text Columns */}
          <div className="mt-6 space-y-4">
            {jobInfo.map((info) => (
              <div key={info.id} className="flex items-center space-x-2">
                <img
                  src={info.imageSrc}
                  alt={`Icon ${info.id}`}
                  className="w-6 h-6"
                />
                <p className="text-black text-base">{info.text}</p>
              </div>
            ))}
          </div>
          {/* Buttons */}
          <div className="mt-10 ">
            <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
              Explore
            </button>
            <button className="text-black px-4 py-2 rounded-lg  items-center">
              Learn More
              <span className="ml-2">{">"}</span>
            </button>
          </div>
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

export default DiscoverFuture;
