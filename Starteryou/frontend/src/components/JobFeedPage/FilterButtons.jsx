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

export default FilterButtons;
