import React, { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";
import LeftSide from "../components/UserProfile/LeftSide";
import RightSide from "../components/UserProfile/RightSide";
import { API_CONFIG } from "../config/api";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const UserProfile = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const token = user?.token;

  const getUserProfile = async () => {
    if (!user?.token) {
      toast.error("Please login to continue...");
      navigate("/UserLogin");
      return;
    }

    const userId = user?.authenticatedUser?._id;

    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUserProfile(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use user.token for better clarity
          },
        }
      );

      if (data.data.length > 0) {
        const profile = data.data[0]; // Access the first profile object
        setProfileData(profile);
        toast.success(data.msg);
      } else {
        toast.error(error.response?.data?.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div>
      <Navbar isEduHero={true} />
      <div className="profile-container pt-[100px] flex flex-col items-center xl:flex-row xl:items-start xl:justify-center">
        <LeftSide
          UserProfile={profileData}
          getProfileFunction={getUserProfile}
        />
        <RightSide UserProfile={profileData} getProfileFunction={getUserProfile}/>
      </div>
    </div>
  );
};

export default UserProfile;
