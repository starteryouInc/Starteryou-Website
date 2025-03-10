/**
 * FilterButtons Component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.filterName - The name of the filter to be displayed
 * @returns {JSX.Element} A styled button container with a filter title
 */
import React from "react";
import "./styles/JobFeedComp.css";

const FilterButtons = (props) => {
  return (
    <div className="filter-buttons-container">
      <h4 className="buttons-title">{props.filterName}</h4>
    </div>
  );
};

FilterButtons.metadata = {
  componentName: "FilterButtons",
  description:
    "A component that displays a title for a filter button container, allowing users to identify the purpose of the associated filter buttons.",
  features: {
    styling: true, // Provides a styled button container
    titleDisplay: true, // Displays the title of the filter
  },
  data: {
    filterName: "", // Name of the filter to be displayed
  },
  accessibility: {
    titleVisibility: "The title is clearly visible for better accessibility.",
  },
  styles: {
    container: {
      backgroundColor: "transparent", // Background color for the filter button container
      padding: "0.5rem 1rem", // Padding for the container
      borderRadius: "0.375rem", // Rounded corners for the container
    },
    title: {
      fontSize: "1.25rem", // Font size for the filter title
      color: "#333", // Text color for the filter title
    },
  },
};
export default FilterButtons;
