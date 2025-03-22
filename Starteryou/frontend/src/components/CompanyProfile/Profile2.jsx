/**
 * Profile2 Component
 *
 * This component allows users to create a company profile by selecting industry,
 * company size, and company type. It also provides a preview of the selected information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.profileData - Object containing profile data
 * @param {Function} props.handleChange - Function to handle changes in input fields
 * @param {Function} props.nextPage - Function to navigate to the next page
 * @param {Function} props.prevPage - Function to navigate to the previous page
 */
import Navbar from "../Common/Navbar";

const Profile2 = ({ profileData, handleChange, nextPage, prevPage }) => {


  return (
    <div>
      <Navbar isEduHero={true} />
      <div className="w-full min-h-screen bg-white p-6 flex flex-col items-center pt-40">
        <h1 className="text-3xl font-bold text-[#232837]">
          Create Your Company Profile
        </h1>
        <p className="text-[#A8B0BC] pt-1">
          Showcase your company to potential candidates
        </p>

        {/* Horizontal Timeline */}
        <div className="flex items-center justify-center my-6 space-x-4">
          <div className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">
            1
          </div>
          <div className="w-[220px]  h-1 bg-purple-600"></div>
          <div className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">
            2
          </div>
          <div className="w-[220px]  h-1 bg-gray-300"></div>
          <div className="w-6 h-6 bg-gray-400 text-white flex items-center justify-center rounded-full">
            3
          </div>
        </div>

        <div className="w-full max-w-6xl flex gap-6 pt-5">
          {/* Left Side - Form */}
          <div className="w-1/2 p-6">
            <h2 className="text-xl font-semibold text-[#3F4251]">
              Industry Details
            </h2>
            <p className="text-[#9FA8B9]">
              Tell us more about your company&apos;s sector and size
            </p>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Industry
              </label>
              <select
                className="w-full p-2 border rounded mt-1 text-[#626672]"
                value={profileData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Company Size
              </label>
              <select
                className="w-full p-2 border rounded mt-1 text-[#626672]"
                value={profileData.companySize}
                onChange={(e) => handleChange("companySize", e.target.value)}
              >
                <option value="">Select Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Company Type
              </label>
              <select
                className="w-full p-2 border rounded mt-1 text-[#626672]"
                value={profileData.companyType}
                onChange={(e) => handleChange("companyType", e.target.value)}
              >
                <option value="">Select Company Type</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Non-profit">Non-profit</option>
                <option value="Government">Government</option>
                <option value="Startup">Startup</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border rounded-md bg-white text-[#6D6E79]"
                onClick={prevPage}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: "#7950F2" }}
                onClick={nextPage}
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
                {profileData.companyName || "Company Name"}
              </h2>
              <p className="text-[#A9B1BF]">Your company tagline</p>
              <div className="mt-4 pt-4 border-t">
                <p>
                  <strong className="text-[#6B6E79]">Industry:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {" "}
                    {profileData.industry || "Not specified"}{" "}
                  </span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Size:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {" "}
                    {profileData.companySize || "Not specified"}{" "}
                  </span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Type:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {" "}
                    {profileData.companyType || "Not specified"}{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile2;
