import React, { useState } from "react";

const SkillsInputForm = ({ openSkillForm }) => {
  const [skills, setSkills] = useState([
    "JAVA",
    "CSS",
    "JavaScript",
    "HTML",
    "JSON",
  ]);
  const [input, setInput] = useState("");

  // Add skill
  const addSkill = (e) => {
    e.preventDefault();
    const newSkill = input.trim();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setInput("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Handle Save button
  const handleSave = () => {
    alert("Skills saved successfully:\n" + skills.join(", "));
    console.log("Saved Skills:", skills);
  };

  // Handle Cancel button
  const handleCancel = () => {
    setInput("");
    openSkillForm();
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
            placeholder="Enter or select your skills"
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
          onClick={handleCancel}
          className="text-purple-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SkillsInputForm;
