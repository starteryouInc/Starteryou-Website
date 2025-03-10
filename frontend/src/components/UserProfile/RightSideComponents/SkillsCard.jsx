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
SkillsCard.metadata = {
  componentName: "SkillsCard",
  description:
    "A component that displays a list of skills with an option to edit them. It visually represents user skills and provides an interactive button for editing.",
  features: {
    editable: true, // Allows users to edit skills
    responsiveDesign: true, // Adapts to different screen sizes
    conditionalRendering: true, // Adjusts layout based on the presence of skills
  },
  data: {
    props: {
      openSkillForm: "Function to open the skill editing form.",
      data: "Array of skills to be displayed.",
    },
  },
  accessibility: {
    buttonLabel: "Edit Skills button is clearly labeled for accessibility.",
  },
  styles: {
    card: {
      position: "relative", // Positioning for the card container
    },
    header: {
      display: "flex", // Flexbox for layout
      justifyContent: "space-between", // Space between header elements
      marginBottom: "1rem", // Margin below the header
    },
    skillItem: {
      padding: "0.5rem 1rem", // Padding for skill items
      backgroundColor: "#E9D8FD", // Background color for skills
      color: "black", // Text color for skills
      fontWeight: "600", // Bold text for skills
      borderRadius: "0.375rem", // Rounded corners for skill items
      fontSize: "0.875rem", // Font size for skill text
    },
  },
};
export default SkillsCard;
