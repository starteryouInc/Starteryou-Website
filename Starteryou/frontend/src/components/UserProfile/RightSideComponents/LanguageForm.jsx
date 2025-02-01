import React, { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { API_CONFIG } from "../../../config/api";
import { toast } from "react-toastify";
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

export default LanguageForm;
