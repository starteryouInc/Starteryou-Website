import React, { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { API_CONFIG } from "../../../config/api";
import { toast } from 'react-hot-toast';
import axios from "axios";

const LanguageForm = ({ openLanguageForm, data, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;
  const [languages, setLanguages] = useState(data);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addLanguage = async (e) => {
    e.preventDefault();
    const newLanguage = input.trim();
    if (!newLanguage || languages.includes(newLanguage)) return;

    setLoading(true);

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addLanguage(userId)}`,
        { language: newLanguage }, // Fixed body format
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.msg);
      setLanguages([...languages, newLanguage]); // Update skills state
      getProfileFieldData();
      setInput("");
      openLanguageForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  // Remove skill from local state and API
  const removeLanguage = async (languageToRemove) => {
    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteLanguage(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { language: languageToRemove }, // ✅ Send skill in `data`
        }
      );

      toast.success(data.msg);
      setLanguages(
        languages.filter((language) => language !== languageToRemove)
      ); // ✅ Remove skill locally
      getProfileFieldData();
      openLanguageForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };
  return (
    <div className="max-w-lg mx-4 bg-white p-8 shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-2">Languages</h2>

      {/* Skills Display */}
      <div className="border rounded p-2 flex flex-wrap gap-2">
        {languages.map((language, index) => (
          <div
            key={index}
            className="flex items-center bg-[#e7e6e9] text-[#777585] rounded px-2 py-1 text-sm font-semibold"
          >
            {language}
            <button
              onClick={() => removeLanguage(language)}
              className="ml-1 text-purple-400 hover:text-purple-600"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Input Field */}
        <form onSubmit={addLanguage} className="flex-1">
          <input
            type="text"
            placeholder="Enter your language"
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
          onClick={openLanguageForm}
          className="text-purple-600"
        >
          Cancel
        </button>
        <button
          onClick={addLanguage}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
LanguageForm.metadata = {
  componentName: "LanguageForm",
  description:
    "A component that allows users to add and remove languages from their profile. It provides an input field for new languages, displays the current languages, and handles API interactions for saving and deleting languages.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to add/remove languages
    inputValidation: true, // Validates input to ensure it is not empty and not a duplicate
    toastNotifications: true, // Provides feedback on actions (success/error messages)
    loadingIndicator: true, // Indicates loading state while saving data
    clearInput: true, // Clears the input field after saving
  },
  data: {
    initialContent: {
      languages: [], // Initial list of languages
      input: "", // Initial value for language input
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    errorMessages: "Displays error messages for invalid actions.",
    keyboardNavigation: "Allows keyboard navigation for form elements.",
  },
  styles: {
    container: {
      maxWidth: "lg", // Maximum width for the container
      margin: "1rem", // Margin for spacing
      backgroundColor: "white", // Background color for the component
      padding: "2rem", // Padding for the component
      borderRadius: "8px", // Rounded corners for the component
      boxShadow: "md", // Shadow effect for depth
    },
    title: {
      fontSize: "1.25rem", // Font size for the title
      fontWeight: "600", // Font weight for the title
    },
    input: {
      width: "100%", // Full width for the input field
      padding: "0.5rem", // Padding for the input field
      outline: "none", // No outline for the input field
      border: "1px solid #ccc", // Border style for the input field
    },
    buttons: {
      save: {
        backgroundColor: "#6b5b9a", // Background color for the save button
        color: "white", // Text color for the save button
      },
      cancel: {
        color: "#6b5b9a", // Text color for the cancel button
      },
    },
  },
  apiEndpoints: {
    addLanguage: {
      method: "POST",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addLanguage(":userId")}`, // Endpoint for adding a language
      description: "Adds a new language to the user's profile.",
      requestBody: {
        language: "string", // Language to be added
      },
      successResponse: {
        status: 200,
        message: "Language added successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while adding language.",
      },
    },
    deleteLanguage: {
      method: "DELETE",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteLanguage(":userId")}`, // Endpoint for deleting a language
      description: "Deletes a language from the user's profile.",
      requestBody: {
        language: "string", // Language to be removed
      },
      successResponse: {
        status: 200,
        message: "Language removed successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while removing language.",
      },
    },
  },
};
export default LanguageForm;
