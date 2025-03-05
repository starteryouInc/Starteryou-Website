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
  const jobInfo = [
    {
      id: 1,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Seamless enrollment process for students and schools.",
    },
    {
      id: 2,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Personalized dashboards to track progress and achievements",
    },
    {
      id: 3,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Engaging community forums for collaboration and support.",
    },
  ];
  return (
    <div className=" mx-auto max-w-[1430px]  px-4 lg:px-10 py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white  flex flex-col justify-center">
          <p className="mb-2">Empower</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black max-w-[500px]">
            Unlock Your Potential with Our Platform
          </h2>
          <p className="text-black text-base max-w-[470px]">
            Our platform connects students with diverse educational
            opportunities, making it easier to find and enroll in courses that
            fit their needs. Schools benefit from increased visibility and
            access to a wider pool of students.
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
            <button className="bg-white text-black border border-black py-2 px-3  mr-4">
              Learn More
            </button>
            <button className="text-black px-4 py-2  items-center">
              Sign Up
              <span className="ml-2">{">"}</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative   overflow-hidden flex justify-center md:items-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px]  "
            />
          ) : (
            <img
              src="/JobPortalPage/Placeholder Image.png"
              alt="Job Opportunities"
              className="relative w-[340px] h-[250px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] "
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
