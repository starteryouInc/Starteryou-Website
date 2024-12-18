import React, { useState } from "react";

const LanguageForm = ({ openLanguageForm }) => {
  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [skills, setSkills] = useState({
    read: false,
    write: false,
    speak: false,
  });

  const handleSkillChange = (e) => {
    const { name, checked } = e.target;
    setSkills({ ...skills, [name]: checked });
  };

  const handleSave = () => {
    const data = { language, proficiency, skills };
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]">
      <h3 className="text-2xl font-semibold mb-4">Languages</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-[#777585] mb-2">
            Languages <span className="text-red-500">*</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#777585] mb-2">
          Proficiency <span className="text-red-500">*</span>
          </label>
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="read"
            checked={skills.read}
            onChange={handleSkillChange}
            className="mr-2"
          />
          Read
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="write"
            checked={skills.write}
            onChange={handleSkillChange}
            className="mr-2"
          />
          Write
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="speak"
            checked={skills.speak}
            onChange={handleSkillChange}
            className="mr-2"
          />
          Speak
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button
          onClick={openLanguageForm}
          className="text-purple-600 "
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LanguageForm;
