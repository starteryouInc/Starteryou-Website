import React, { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { API_CONFIG } from "../../../config/api";
import { toast } from 'react-hot-toast';
import axios from "axios";
/**
 * Component for managing skills input, allowing users to add and remove skills.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.openSkillForm - Function to toggle the skill input form.
 * @param {string[]} props.data - Initial array of skills.
 * @param {Function} props.getProfileFieldData - Function to refresh the profile field data.
 * @returns {JSX.Element} The SkillsInputForm component.
 */
const SkillsInputForm = ({ openSkillForm, data, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;
  const [skills, setSkills] = useState(data);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Adds a new skill via API and updates the state.
   *
   * @param {Event} e - The form submit event.
   * @returns {Promise<void>} A promise that resolves when the skill is added.
   */
  const addSkill = async (e) => {
    e.preventDefault();
    const newSkill = input.trim();
    if (!newSkill || skills.includes(newSkill)) return;

    setLoading(true);

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addSkill(userId)}`,
        { skill: newSkill }, // Fixed body format
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.msg);
      setSkills([...skills, newSkill]); // Update skills state
      getProfileFieldData();
      setInput("");
      openSkillForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a skill via API and updates the state.
   *
   * @param {string} skillToRemove - The skill to remove.
   * @returns {Promise<void>} A promise that resolves when the skill is removed.
   */
  const removeSkill = async (skillToRemove) => {
    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteSkill(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { skill: skillToRemove }, // ✅ Send skill in `data`
        }
      );

      toast.success(data.msg);
      setSkills(skills.filter((skill) => skill !== skillToRemove)); // ✅ Remove skill locally
      getProfileFieldData();
      openSkillForm();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to remove skill.");
    }
  };

  return (
    <div className="max-w-lg mx-4 bg-white p-8 shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-2">Skills</h2>

      {/* Skills Display */}
      <div className="border rounded p-2 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center bg-[#e7e6e9] text-[#777585] rounded px-2 py-1 text-sm font-semibold"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 text-purple-400 hover:text-purple-600"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Input Field */}
        <form onSubmit={addSkill} className="flex-1">
          <input
            type="text"
            placeholder="Enter your skill"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full outline-none p-1"
          />
        </form>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={openSkillForm}
          className="text-purple-600"
        >
          Cancel
        </button>
        <button
          onClick={addSkill}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
SkillsInputForm.metadata = {
  componentName: "SkillsInputForm",
  description:
    "A component for managing user skills, allowing users to add and remove skills with API integration.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to manage skills
    inputValidation: true, // Validates skill input to prevent duplicates
    toastNotifications: true, // Provides feedback on skill addition and removal
    editable: true, // Users can edit their skills
  },
  data: {
    initialContent: {
      skills: [], // Initial array of skills
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    editable: "Allows users to easily manage their skills.",
  },
  styles: {
    container: {
      maxWidth: "lg", // Maximum width for the container
      padding: "2rem", // Padding around the content
      backgroundColor: "white", // Background color for the component
    },
    skillItem: {
      display: "flex", // Flexbox for skill items
      alignItems: "center", // Center items vertically
      backgroundColor: "#e7e6e9", // Background color for skill items
      color: "#777585", // Text color for skills
      borderRadius: "0.375rem", // Rounded corners for skill items
      padding: "0.5rem 0.75rem", // Padding for skill items
      fontSize: "0.875rem", // Font size for skill text
    },
    input: {
      width: "100%", // Full width for input
      outline: "none", // Remove outline on focus
      padding: "0.25rem", // Padding for input
    },
    buttons: {
      save: {
        backgroundColor: "#6BBE45", // Background color for the save button
        color: "white", // Text color for the save button
      },
      cancel: {
        backgroundColor: "red", // Background color for the cancel button
        color: "white", // Text color for the cancel button
      },
    },
  },
  apiEndpoints: {
    addSkill: {
      method: "POST",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addSkill(":userId")}`, // Endpoint for adding a skill
      description: "Adds a new skill for the user.",
      requestBody: {
        skill: "string", // The skill to be added
      },
      successResponse: {
        status: 200,
        message: "Skill added successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while adding skill.",
      },
    },
    removeSkill: {
      method: "DELETE",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteSkill(":userId")}`, // Endpoint for removing a skill
      description: "Removes a skill for the user.",
      requestBody: {
        skill: "string", // The skill to be removed
      },
      successResponse: {
        status: 200,
        message: "Skill removed successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while removing skill.",
      },
    },
  },
};
export default SkillsInputForm;
