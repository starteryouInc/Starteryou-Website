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
LanguagesCard.metadata = {
  componentName: "LanguagesCard",
  description:
    "A component that displays the user's languages in a card format. It includes an edit button that opens a language form to allow users to add or remove languages.",
  features: {
    userAuthentication: false, // No authentication required for viewing languages
    editable: true, // Allows users to edit the list of languages
    responsiveDesign: true, // Adapts to different screen sizes
    iconDisplay: true, // Displays an icon alongside the title
  },
  data: {
    initialContent: {
      languages: [], // Initial list of languages to be displayed
    },
  },
  accessibility: {
    header: "Contains a header with clear labels for the section.",
    editButton: "Edit button is clearly labeled and accessible.",
    languageLabels: "Languages are displayed with sufficient contrast.",
  },
  styles: {
    container: {
      position: "relative", // Position for the card
      padding: "1rem", // Padding for the card
      backgroundColor: "white", // Background color for the card
      borderRadius: "8px", // Rounded corners for the card
      boxShadow: "md", // Shadow effect for depth
    },
    title: {
      fontSize: "1.25rem", // Font size for the title
      fontWeight: "600", // Font weight for the title
      color: "#4A4A4A", // Text color for the title
    },
    languages: {
      padding: "0.5rem", // Padding for language badges
      backgroundColor: "#E6E6FA", // Background color for language badges
      borderRadius: "4px", // Rounded corners for language badges
      fontSize: "0.875rem", // Font size for language badges
    },
    editButton: {
      background: "transparent", // Transparent background for the button
      border: "none", // No border for the button
      cursor: "pointer", // Pointer cursor for the button
    },
  },
  apiEndpoints: {
    // No API endpoints are directly associated with this component as it only displays data
  },
};
export default LanguagesCard;
