import React from "react";
import EditPen from "/UserProfile/EditPen.svg";
import { PiListChecksBold } from "react-icons/pi";
import "../styles/RightSide.css";

const SkillsCard = ({ openSkillForm, data }) => {
  return (
    <div className="skills-card relative">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          data.length !== 0 ? "mb-4" : "mb-0"
        }`}
      >
        <div className="flex items-center">
          <PiListChecksBold className="text-2xl text-gray-700 mr-2" />
          <h2 className="text-xl">Skills</h2>
        </div>

        {/* Edit Button */}
        <button onClick={openSkillForm}>
          <img src={EditPen} alt="Edit Skills" />
        </button>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-4">
        {data.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-purple-100 text-black font-semibold rounded-md text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsCard;
