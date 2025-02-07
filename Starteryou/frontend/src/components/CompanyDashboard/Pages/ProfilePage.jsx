import React from "react";
import { FaBuilding, FaUsers, FaEye } from "react-icons/fa";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

const ProfilePage = () => {
  return (
    <div className="company-detail-container mt-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border-2">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <FaBuilding className="text-4xl text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">TechCorp Solutions</h1>
            <div className="flex items-center text-gray-500 text-sm gap-2">
              <span>Technology</span>
              <MdLocationOn /> <span>San Francisco, CA</span>
              <FaUsers /> <span>50-200 employees</span>
              <MdDateRange /> <span>Founded 2018</span>
            </div>
          </div>
          <button className="ml-auto px-4 py-2 bg-gray-200 rounded-lg">
            Follow Company
          </button>
        </div>

        {/* About Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-gray-600 mt-2">
            TechCorp Solutions is a leading technology company specializing in
            innovative software solutions. We're passionate about creating
            cutting-edge products that solve real-world problems. Our team of
            dedicated professionals works together to deliver exceptional
            results for our clients while fostering a culture of innovation and
            continuous learning.
          </p>
        </div>

        {/* Insights Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Company Insights</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center text-blue-500">
              <FaUsers className="text-3xl" />
              <span className="text-xl font-bold">1.2k</span>
              <span className="text-sm text-gray-500">Total Applicants</span>
            </div>
            <div className="flex flex-col items-center text-green-500">
              <FaEye className="text-3xl" />
              <span className="text-xl font-bold">15k</span>
              <span className="text-sm text-gray-500">Profile Views</span>
            </div>
            <div className="flex flex-col items-center text-purple-500">
              <BsGraphUp className="text-3xl" />
              <span className="text-xl font-bold">89%</span>
              <span className="text-sm text-gray-500">Engagement Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
