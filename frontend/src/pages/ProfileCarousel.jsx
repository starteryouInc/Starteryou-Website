import { useState } from "react";
import Profile1 from "../components/CompanyProfile/Profile1";
import Profile2 from "../components/CompanyProfile/Profile2";
import Profile3 from "../components/CompanyProfile/Profile3";
import { useUserContext } from "../context/UserContext";
import { toast } from 'react-hot-toast';
import { API_CONFIG } from "../config/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ProfileCarousel component - Manages a multi-step company profile form.
 * Allows users to input company details, navigate between steps, and submit the form.
 *
 * @returns {JSX.Element} The ProfileCarousel component.
 */
const ProfileCarousel = () => {
  const [step, setStep] = useState(1);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const token = user?.token;
  const companyName = user?.authenticatedUser?.companyName;
  const companyWebsite = user?.authenticatedUser?.companyWebsite;

  const [profileData, setProfileData] = useState({
    companyName: companyName,
    companyWebsite: companyWebsite,
    industry: "",
    companySize: "",
    companyType: "",
    location: "",
    foundedDate: "",
    tagline: "",
    about: "",
  });

  /**
   * Clears all fields in the profile form.
   */
  const clearAllFields = () => {
    setProfileData({
      companyName: "",
      companyWebsite: "",
      industry: "",
      companySize: "",
      companyType: "",
      location: "",
      foundedDate: "",
      tagline: "",
      about: "",
    });
  };

  /**
   * Handles input field changes.
   *
   * @param {string} field - The name of the field being updated.
   * @param {string} value - The new value of the field.
   */
  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to go to the next step
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  // Function to go to the previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  /**
   * Handles form submission by sending profile data to the API.
   * Validates required fields before submitting.
   * Displays success or error messages using toast notifications.
   */
  const handleSubmit = async () => {
    if (!profileData.companyName) {
      toast.error("Pls fill are the required fields");
      return;
    }

    const foundedYear = profileData.foundedDate
      ? new Date(`${profileData.foundedDate}-01-01`)
      : null;

    try {
      const userId = user?.authenticatedUser?._id;
      console.log("UserId : ", userId);
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createCompanyProfile}`,
        {
          employerRegistrationId: userId,
          ...profileData,
          foundedDate: foundedYear,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      navigate("/companyDashboard/");
      clearAllFields();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <div className="">
      {step === 1 && (
        <Profile1
          profileData={profileData}
          handleChange={handleChange}
          nextPage={nextStep}
        />
      )}
      {step === 2 && (
        <Profile2
          profileData={profileData}
          handleChange={handleChange}
          nextPage={nextStep}
          prevPage={prevStep}
        />
      )}
      {step === 3 && (
        <Profile3
          profileData={profileData}
          handleChange={handleChange}
          prevPage={prevStep}
          handlePublish={handleSubmit}
        />
      )}

      {/* <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Profile
          </button>
        )}
      </div> */}
    </div>
  );
};

export default ProfileCarousel;
