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
SocialPresenceForm.metadata = {
  componentName: "SocialPresenceForm",
  description: "A form component for adding a social media profile and link.",
  props: {
    openSocialForm: {
      type: "function",
      description: "Function to close the form.",
    },
  },
  state: {
    socialProfile: {
      type: "string",
      description: "The social media profile entered by the user.",
    },
    link: {
      type: "string",
      description: "The link to the social media profile entered by the user.",
    },
  },
  methods: {
    handleSave: {
      description: "Handles the save action by logging the form data.",
      return: "void",
    },
  },
  styles: {
    container: {
      maxWidth: "max-w-3xl", // Maximum width for the container
      margin: "mx-4", // Horizontal margin
      backgroundColor: "bg-white", // Background color
      padding: "p-8", // Padding
      border: "border", // Border
      borderRadius: "rounded-lg", // Border radius
      space: "space-y-4", // Space between elements
      mdWidth: "md:w-[560px]", // Width for medium screens
    },
    heading: {
      fontSize: "text-2xl", // Font size for heading
      fontWeight: "font-semibold", // Font weight for heading
      marginBottom: "mb-4", // Bottom margin for heading
    },
    label: {
      fontWeight: "font-semibold", // Font weight for labels
      color: "text-[#777585]", // Color for labels
      marginBottom: "mb-2", // Bottom margin for labels
    },
    input: {
      width: "w-full", // Full width for inputs
      padding: "p-2", // Padding for inputs
      border: "border border-gray-300", // Border for inputs
      borderRadius: "rounded", // Border radius for inputs
      focus: "focus:outline-none focus:ring-2 focus:ring-purple-500", // Focus styles
    },
    button: {
      save: {
        backgroundColor: "bg-purple-600", // Background color for save button
        color: "text-white", // Text color for save button
        padding: "py-2 px-6", // Padding for save button
        borderRadius: "rounded", // Border radius for save button
        hoverEffect: "hover:bg-purple-700", // Hover effect for save button
      },
      cancel: {
        color: "text-purple-600", // Text color for cancel button
      },
    },
  },
};
export default SocialPresenceForm;
