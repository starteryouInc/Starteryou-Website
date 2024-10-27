import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import FileUpload from "../Common/FileUpload";
const OurVision = () => {
  const [preview, setPreview] = useState(null);
  const { isAdmin } = useNavigation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    console.log("Selected file:", file);
  };
  return (
    <div className="max-w-[1300px] mx-auto container px-4 py-10">
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* Text Box */}
        <div className="bg-white p-2 md:p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center md:order-2">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] uppercase">
              OUR Vision
            </h2>
            <p className="text-[#1F2329] text-base">
              Starteryou envisions a world where every student has access to
              diverse job opportunities, gaining essential work experience and
              building a foundation for their future careers. We aspire to be
              the go-to Student Employment Hub, continually innovating and
              expanding our offerings to enhance the job-seeking journey for
              both students and employers.
            </p>
          </div>
        </div>

        {/* Image Box */}
        <div className="relative flex-1 items-center justify-center  rounded-lg mb-4 md:mb-0 h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="relative h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          ) : (
            <img
              src="/AboutPage/vision.svg"
              alt="vision"
              className="relative h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            />
          )}
          {/* Admin file upload section */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
    </div>
  );
};

export default OurVision;
