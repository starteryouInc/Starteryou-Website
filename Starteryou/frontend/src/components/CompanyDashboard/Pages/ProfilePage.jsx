import React, { useEffect, useState } from "react";
import { FaBuilding, FaUsers, FaEye } from "react-icons/fa";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "react-toastify";
import { API_CONFIG } from "../../../config/api";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useUserContext();
  const [companyProfile, setCompanyProfile] = useState([]);
  const token = user?.token;

  function formatFoundedYear(foundedDate) {
    return new Date(foundedDate).getFullYear().toString();
  }

  const getCompanyProfile = async () => {
    if (!token) {
      toast.error("Pls login to continue...");
      return;
    }
    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getCompanyProfile(
          userId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompanyProfile(data.data);
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  useEffect(() => {
    getCompanyProfile();
  }, []);

  return (
    <div className="company-detail-container my-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg border-2">
        {/* Header Section */}
        <div className="flex items-center justify-between min-w-[800px]">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 p-4 rounded-lg">
              <FaBuilding className="text-4xl text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {companyProfile.companyName}
              </h1>
              <div className="flex items-center text-gray-500 text-sm space-x-4">
                <span>{companyProfile.industry}</span>
                <span className="flex items-center">
                  <MdLocationOn className="mr-1" />{" "}
                  <span>{companyProfile.location}</span>
                </span>
                <span className="flex items-center">
                  <FaUsers className="mr-1" />{" "}
                  <span>{companyProfile.companySize}</span>
                </span>
                <span className="flex items-center">
                  <MdDateRange className="mr-1" />{" "}
                  <span>
                    Founded {formatFoundedYear(companyProfile.foundedDate)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <button className="ml-auto px-4 py-2 bg-gray-200 rounded-lg capitalize">
            <Link to="/createProfile">Update your profile</Link>
          </button>
        </div>

        {/* About Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-gray-600 mt-2">{companyProfile.about}</p>
          <div className="tagline-container mt-5 flex items-start">
            <h3 className="font-semibold">Tagline: </h3>
            <p className="ml-3 text-gray-600">{companyProfile.tagline}</p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Company Insights</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center text-blue-500">
              <FaUsers className="text-3xl mb-4" />
              <span className="text-xl text-black font-bold">1.2k</span>
              <span className="text-sm text-gray-500">Total Applicants</span>
            </div>
            <div className="flex flex-col items-center text-green-500">
              <FaEye className="text-3xl mb-4" />
              <span className="text-xl text-black font-bold">15k</span>
              <span className="text-sm text-gray-500">Profile Views</span>
            </div>
            <div className="flex flex-col items-center text-purple-500">
              <BsGraphUp className="text-3xl mb-4" />
              <span className="text-xl text-black font-bold">89%</span>
              <span className="text-sm text-gray-500">Engagement Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
