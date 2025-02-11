import React, { useEffect, useState } from "react";
import "./styles/LeftSide.css";
import Flag from "/UserProfile/Flag.svg";
import EditPen from "/UserProfile/EditPen.svg";
import WhiteEditPen from "/UserProfile/WhiteEditPen.svg";
import GreenTick from "/UserProfile/GreenTick.svg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  PiBuildingOfficeLight,
  PiBagSimpleFill,
  PiWarningCircleFill,
} from "react-icons/pi";
import {
  IoLogoLinkedin,
  IoLogoInstagram,
  IoLogoTwitter,
  IoMailOutline,
  IoCloseOutline,
} from "react-icons/io5";
import SocialPresenceForm from "./LeftSideComponent/SocialPresenceForm";
import { API_CONFIG } from "../../config/api";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

/**
 * LeftSide component displays the user's profile information, allowing for editing and updating profile details.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.UserProfile - User profile data
 * @param {Function} props.getProfileFunction - Function to refresh the user profile after updates
 * @returns {JSX.Element} - LeftSide component
 */
const LeftSide = ({ UserProfile, getProfileFunction }) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [openSocialForm, setOpenSocialForm] = useState(false);
  const [updateProfileData, setUpdateProfileData] = useState({});
  const token = user?.token;

  /**
   * Initializes the profile data when the component mounts or when `UserProfile` changes.
   */
  useEffect(() => {
    setUpdateProfileData({
      name: UserProfile?.name || "John Oliver",
      professionalTitle: UserProfile?.professionalTitle || "Professional Title",
      location: UserProfile?.location || " ",
      companyName: UserProfile?.currentCompany || "Company Name",
      experience: UserProfile?.totalExperience || " ",
      email: UserProfile?.email || "xyz@starteryou.com",
      phoneNo: UserProfile?.phoneNo || "7845129630",
    });
  }, [UserProfile]);

  /**
   * Handles the update of user profile data by making a PATCH request to the API.
   * Displays success or error messages using toast notifications.
   *
   * @async
   */
  const handleUpdateProfile = async () => {
    if (!user?.token) {
      toast.error("Pls login to continue...");
      return;
    }
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.patch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateUserProfile(
          userId
        )}`,
        {
          professionalTitle: updateProfileData.professionalTitle,
          location: updateProfileData.location,
          currentCompany: updateProfileData.companyName,
          totalExperience: updateProfileData.experience,
          phoneNo: updateProfileData.phoneNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      setIsEditing(false);
      getProfileFunction();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <>
      <section className="left md:w-[560px] lg:w-[660px] xl:w-[460px]">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="purple-section">
            {isEditing ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-green-600 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
                <IoCloseOutline
                  onClick={() => setIsEditing(false)}
                  className="text-2xl text-white cursor-pointer"
                />
              </div>
            ) : (
              <img
                src={WhiteEditPen}
                onClick={() => setIsEditing(true)}
                alt="edit btn"
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="profile-card-sub space-y-10">
            {isEditing ? (
              <ul className="first-list flex flex-col items-center space-y-4">
                <li>
                  <FaRegCircleUser className="text-[60px] text-white bg-[#e7e6e9] rounded-full" />
                </li>
                <li>
                  <img src={Flag} alt="Country Flag" />
                </li>
                <li className="text-[24px] font-semibold uppercase">
                  {updateProfileData.name}
                </li>
                <li>
                  <input
                    type="text"
                    value={updateProfileData.professionalTitle}
                    onChange={(e) =>
                      setUpdateProfileData((prev) => ({
                        ...prev,
                        professionalTitle: e.target.value,
                      }))
                    }
                    className="bg-transparent border-b border-gray-300 outline-none text-center"
                    placeholder="Enter job title"
                  />
                </li>
                <li className="line-style"></li>
                <li className="flex items-center">
                  <MdLocationOn className="icon-style mr-2" />
                  <input
                    type="text"
                    value={updateProfileData.location}
                    onChange={(e) =>
                      setUpdateProfileData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="bg-transparent border-b border-gray-300 outline-none"
                    placeholder="Enter location"
                  />
                </li>
              </ul>
            ) : (
              <ul className="first-list flex flex-col items-center space-y-2">
                <li>
                  <FaRegCircleUser className="text-[60px] text-white bg-[#e7e6e9] rounded-full" />
                </li>
                <li>
                  <img src={Flag} alt="Country Flag" />
                </li>
                <li className="text-[24px] font-semibold uppercase">
                  {updateProfileData.name}
                </li>
                <li>{updateProfileData.professionalTitle}</li>
                <li className="line-style"></li>
                <li className="flex items-center">
                  <MdLocationOn className="icon-style mr-2" />
                  {updateProfileData.location}
                </li>
              </ul>
            )}

            {/* Contact Info */}
            <ul className="space-y-4 secondary-text-color">
              {[
                {
                  icon: PiBuildingOfficeLight,
                  text: updateProfileData.companyName,
                  noChange: false,
                  onChange: (value) =>
                    setUpdateProfileData((prev) => ({
                      ...prev,
                      companyName: value,
                    })),
                },
                {
                  icon: PiBagSimpleFill,
                  text: updateProfileData.experience,
                  noChange: false,
                  onChange: (value) =>
                    setUpdateProfileData((prev) => ({
                      ...prev,
                      experience: value,
                    })),
                },
                {
                  icon: FaPhoneAlt,
                  text: updateProfileData.phoneNo,
                  editable: true,
                  noChange: false,
                  onChange: (value) =>
                    setUpdateProfileData((prev) => ({
                      ...prev,
                      phoneNo: value,
                    })),
                },
                {
                  icon: IoMailOutline,
                  text: updateProfileData.email,
                  editable: true,
                  noChange: true,
                },
              ].map(
                ({ icon: Icon, text, editable, noChange, onChange }, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Icon className="icon-style mr-4" />
                      {isEditing && !noChange ? (
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => onChange(e.target.value)}
                          className="bg-transparent border-b border-gray-300 outline-none"
                        />
                      ) : (
                        <span>{text}</span>
                      )}
                    </div>
                    {editable && !isEditing && (
                      <div className="flex items-center space-x-4">
                        <img src={EditPen} alt="Edit" />
                        <img src={GreenTick} alt="Verified" />
                      </div>
                    )}
                  </li>
                )
              )}
            </ul>

            {/* Profile Completion */}
            <div className="profile-completion space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-semibold">
                  95% Profile Complete
                </h2>
                <PiWarningCircleFill className="icon-style text-[#6a54df]" />
              </div>
              <h4 className="secondary-text-color">
                Recruiters Notice you from 70%
              </h4>
              <label>
                0%
                <input type="range" name="" id="" className="py-6" />
                100%
              </label>
              <h2 className="p-5 flex justify-between bg-[#f7f2fa] rounded-[18px]">
                <span>Profile Picture</span>
                <span className="text-[#6a54df]">Add 5%</span>
              </h2>
            </div>

            <h2 className="text-center secondary-text-color text-[18px] font-semibold">
              Updated on : 29 November 2024
            </h2>
          </div>
        </div>

        {/* Availability Section */}
        <div className="availability-section flex justify-between items-center">
          <h2>Are you available to join immediately</h2>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        {/* Social Media Links */}
        <div className="social-media-links-section space-y-4">
          <div className="social-media-title">
            <h2>Social Presence</h2>
            <button
              onClick={() => setOpenSocialForm(true)}
              className="text-[#6a54df] font-semibold"
            >
              + Add
            </button>
          </div>
          <ul className="space-y-4 secondary-text-color">
            <li className="social-media-list">
              <h3>Linked in</h3>
              <IoLogoLinkedin className="icon-style text-[#0a66c2]" />
            </li>
            <li className="social-media-list">
              <h3>Instagram</h3>
              <IoLogoInstagram className="icon-style bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#962fbf] text-white rounded-lg" />
            </li>
            <li className="social-media-list">
              <h3>Twitter</h3>
              <IoLogoTwitter className="icon-style text-[#1da1f2]" />
            </li>
          </ul>
        </div>
      </section>

      {openSocialForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <SocialPresenceForm openSocialForm={() => setOpenSocialForm(false)} />
        </div>
      )}
    </>
  );
};

export default LeftSide;
