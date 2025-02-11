import React from 'react';
import "./styles/JobFeedComp.css";

const FilterButtons = (props) => {
  return (
    <div className='filter-buttons-container'>
        <h4 className='buttons-title'>{props.filterName}</h4>        
    </div>
  )
}

export default FilterButtons