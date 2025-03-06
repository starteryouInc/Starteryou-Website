import { useState, useEffect } from "react";
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

  /**
   * Fetches the user's profile data from the server.
   *
   * @async
   * @function getUserProfile
   * @throws {Error} Displays an error toast if the user is not logged in or if the request fails.
   *
   * @description
   * - Checks if the user is authenticated. If not, shows an error toast and redirects to login.
   * - Retrieves the authenticated user's ID and fetches their profile from the API.
   * - If profile data is found, updates the state and shows a success toast.
   * - If no data is found or an error occurs, displays an error toast.
   */
  const getUserProfile = async () => {
    if (!user?.token) {
      toast.error("Please login to continue...");
      navigate("/UserLogin");
      return;
    }

    try {
      const userId = user?.authenticatedUser?._id;
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

  /**
 * Fetches a specific field from the user's profile.
 * 
 * @async
 * @function getUserProfileField
 * @param {string} fieldName - The name of the profile field to retrieve.
 * @returns {Promise<any|null>} The value of the requested profile field if successful, otherwise `null`.
 * 
 * @throws {Error} Displays an error toast if the request fails.
 * 
 * @description 
 * - Retrieves the authenticated user's ID.
 * - Sends a request to fetch a specific field from the user's profile.
 * - If successful, returns the requested field data.
 * - If an error occurs, logs the error and returns `null`.
 */

  const getUserProfileField = async (fieldName) => {
    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUserProfileField(
          userId
        )}?field=${fieldName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.msg);
      console.error("Not working");
      return null;
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
        <RightSide getProfileFieldFunction={getUserProfileField} />
      </div>
    </div>
  );
};

export default UserProfile;
