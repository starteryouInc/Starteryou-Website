import React, { useState } from "react";

/**
 * A form component for adding a social media profile and link.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.openSocialForm - Function to close the form.
 * @returns {JSX.Element} The SocialPresenceForm component.
 */
const SocialPresenceForm = ({ openSocialForm }) => {
  const [socialProfile, setsocialProfile] = useState("");
  const [link, setLink] = useState("");

  /**
   * Handles the save action by logging the form data.
   */
  const handleSave = () => {
    const data = {
      socialProfile,
      link,
    };
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]">
      <h3 className="text-2xl font-semibold mb-4">Social Presence</h3>

      <label className="block font-semibold text-[#777585] mb-2">
        Social Profile <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter your social profile"
        value={socialProfile}
        onChange={(e) => setsocialProfile(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">
        Social Link <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter your social link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

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
