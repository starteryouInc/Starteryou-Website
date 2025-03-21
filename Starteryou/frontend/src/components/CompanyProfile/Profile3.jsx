/**
 * Profile3 Component
 *
 * This component allows users to create and preview a company profile with additional details.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.profileData - Profile data containing tagline and about information
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.handlePublish - Function to handle the publish action
 * @param {Function} props.prevPage - Function to navigate to the previous page
 */
import Navbar from "../Common/Navbar";

const Profile3 = ({ profileData, handleChange, handlePublish, prevPage }) => {
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
          <div className="w-[220px] h-1 bg-purple-600"></div>
          <div className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">
            2
          </div>
          <div className="w-[220px] h-1 bg-purple-600"></div>
          <div className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">
            3
          </div>
        </div>

        <div className="w-full max-w-6xl flex gap-6 pt-5">
          {/* Left Side - Form */}
          <div className="w-1/2 p-6">
            <h2 className="text-xl font-semibold text-[#3F4251]">
              Additional Details
            </h2>
            <p className="text-[#9FA8B9]">
              Add more information to make your profile stand out
            </p>

            {/* Location */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Location
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 text-[#A9B1BE]"
                placeholder="A short, catchy description of your company"
                value={profileData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            {/* Founded Date */}
            <label className="mt-4 block text-sm font-semibold text-[#626672]">
              Founded Year
            </label>
            <select
              name="foundedDate"
              value={profileData.foundedDate}
              onChange={(e) => handleChange("foundedDate", e.target.value)}
              className="border p-2 rounded w-full mb-2"
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={2024 - i}>
                  {2024 - i}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                Tagline
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 text-[#A9B1BE]"
                placeholder="A short, catchy description of your company"
                value={profileData.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[#626672]">
                About
              </label>
              <textarea
                className="w-full p-2 h-24 border rounded mt-1 resize-y text-[#A9B1BE]"
                placeholder="Tell us about your company's mission and values"
                value={profileData.about}
                onChange={(e) => handleChange("about", e.target.value)}
              />
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
                onClick={handlePublish}
              >
                Save & Publish
              </button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-1/2 p-6 bg-[#F8FAFC] self-start border border-[#F3F6F9] ">
            <div className="text-left font-semibold text-[#656874]">
              Preview
            </div>
            <div className="border p-4 rounded mt-4 bg-white">
              <h2 className="text-lg font-bold text-[#323645]">
                {profileData.companyName || "Company Name"}
              </h2>
              <p className="text-[#A9B1BF]">
                {profileData.tagline || "Your company tagline"}
              </p>
              <div className="mt-4 pt-4 border-t">
                <p>
                  <strong className="text-[#6B6E79]">Industry:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {profileData.industry || "Not specified"}
                  </span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Size:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {profileData.companySize || "Not specified"}
                  </span>
                </p>
                <p>
                  <strong className="text-[#6B6E79]">Type:</strong>
                  <span className="pl-1 text-[#A6AEBC]">
                    {profileData.companyType || "Not specified"}
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

export default Profile3;
