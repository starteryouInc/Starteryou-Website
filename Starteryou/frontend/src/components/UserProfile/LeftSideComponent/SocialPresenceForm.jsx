import React, { useState } from "react";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import axios from "axios";

/**
 * A form component for adding social media profiles and links.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.openSocialForm - Function to close the form.
 * @returns {JSX.Element} The SocialPresenceForm component.
 */
const SocialPresenceForm = ({ openSocialForm }) => {
  const [links, setLinks] = useState({
    LinkedIn: "",
    Instagram: "",
    Twitter: "",
  });

  const { user } = useUserContext();
  const token = user?.token;
  const userId = user?.authenticatedUser?._id;
  console.log(userId)

  /**
   * Handles the save action by logging the form data.
   */
  const handleSave = async () => {
    console.log("Form Data:", links);
  
    if (!userId || !token) {
      alert("User not authenticated. Please log in.");
      return;
    }
  
    // Filter out empty fields to avoid sending unnecessary data
    const filteredLinks = Object.fromEntries(
      Object.entries(links).filter(([_, value]) => value.trim() !== "")
    );
  
    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addSocialLinks(userId)}`,
        filteredLinks, // Send only non-empty values
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Success:", response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating social links:", error);
      alert("Failed to update social links.");
    }
  };

  return (
    <div className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]">
      <h3 className="text-2xl font-semibold mb-4">Social Presence</h3>

      {Object.keys(links).map((platform) => (
        <div key={platform}>
          <label className="block font-semibold text-[#777585] mb-2">
            {platform} Link <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`Enter your ${platform} link`}
            value={links[platform]}
            onChange={(e) => setLinks({ ...links, [platform]: e.target.value })}
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button onClick={openSocialForm} className="text-purple-600">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SocialPresenceForm;
