import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import Navbar from "../Common/Navbar";
import { useNavigate } from "react-router-dom";

const Profile1 = ({ profileData, handleChange, nextPage }) => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );
  const [companyLogo, setCompanyLogo] = useState(
    localStorage.getItem("companyLogo") || null
  );

  useEffect(() => {
    localStorage.setItem("companyName", companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem("companyLogo", companyLogo);
  }, [companyLogo]);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCompanyLogo(imageUrl);
      localStorage.setItem("companyLogo", imageUrl);
    }
  };

  return (
    <div>
      <Navbar isEduHero={true} />
      <div className="w-full min-h-screen bg-white p-6 flex flex-col items-center pt-40 ">
        <h1 className="text-3xl font-bold text-[#232837]">
          Create Your Company Profile
        </h1>
        <p className="text-[#A8B0BC] pt-1">
          Showcase your company to potential candidates
        </p>

        {/* Timeline */}
        <div className="flex items-center justify-center my-6 space-x-4">
          <div className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">
            1
          </div>
          <div className="w-[220px] h-1 bg-gray-300"></div>{" "}
          {/* Increased width */}
          <div className="w-6 h-6 bg-gray-400 text-white flex items-center justify-center rounded-full">
            2
          </div>
          <div className="w-[220px] h-1 bg-gray-300"></div>{" "}
          {/* Increased width */}
          <div className="w-6 h-6 bg-gray-400 text-white flex items-center justify-center rounded-full">
            3
          </div>
        </div>

        <div className="w-full max-w-6xl flex gap-6 pt-5">
          {/* Left Side - Form */}
          <div className="w-1/2 p-6">
            <h2 className="text-xl font-semibold text-[#3F4251]">
              Basic Details
            </h2>
            <p className="text-[#9FA8B9]">
              Let&apos;s start with your company&apos;s core information
            </p>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Company Name
              </label>
              <input
                type="text "
                className="w-full p-2 border rounded mt-1 text-[#A9B1BE]"
                placeholder="Enter company name"
                value={profileData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Company Logo
              </label>

              <label className="w-full border-2 border-dashed p-6 flex flex-col items-center justify-center rounded-lg cursor-pointer relative">
                {companyLogo ? (
                  <div className="relative">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="h-16"
                    />
                    <button
                      onClick={() => setCompanyLogo(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload size={24} className="text-gray-500" />
                    <p className="text-[#646773] text-md">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-[#ACB4C2] text-sm">
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Website URL
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 text-[#A9B1BE]"
                placeholder="Enter website URL"
                value={profileData.companyWebsite}
                onChange={(e) => handleChange("companyWebsite", e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border rounded-md bg-white cursor-not-allowed opacity-50 text-[#6D6E79]"
                disabled
              >
                Previous
              </button>

              <button
                className="px-4 py-2 rounded-md text-white"
                // onClick={() => navigate("/profile2")}
                onClick={nextPage}
                style={{ backgroundColor: "#7950F2" }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-1/2 p-6 bg-[#F8FAFC] self-start border border-[#F3F6F9]">
            <div className="text-left font-semibold text-[#656874]">
              Preview
            </div>
            <div className="border p-4 rounded mt-3 bg-white">
              <h2 className="text-lg font-bold text-[#323645]">
                {companyName || "Company Name"}
              </h2>
              <p className="text-[#A9B1BF]">Your company tagline</p>
              <div className="mt-4 pt-4 border-t">
                <p>
                  <strong className="text-[#6B6E79]">Industry:</strong>
                  <span className="pl-1 text-[#A6AEBC]">Not specified</span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Size:</strong>
                  <span className="pl-1 text-[#A6AEBC]"> Not specified </span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Type:</strong>
                  <span className="pl-1 text-[#A6AEBC]"> Not specified</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile1;
