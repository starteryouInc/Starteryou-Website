import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { PiListChecksBold } from "react-icons/pi";

const LanguagesCard = ({ openLanguageForm, data }) => {
  return (
    <div className="language-display-card relative">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          data.length !== 0 ? "mb-4" : "mb-0"
        }`}
      >
        <div className="flex items-center">
          <PiListChecksBold className="text-2xl text-gray-700 mr-2" />
          <h2 className="text-xl">Languages</h2>
        </div>

        {/* Edit Button */}
        <button onClick={openLanguageForm}>
          <img src={EditPen} alt="Edit Skills" />
        </button>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-4">
        {data.map((language, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-purple-100 text-black font-semibold rounded-md text-sm"
          >
            {language}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LanguagesCard;
