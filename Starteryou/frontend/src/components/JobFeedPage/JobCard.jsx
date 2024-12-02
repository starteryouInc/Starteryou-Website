import React from "react";
import SaveJob from "/JobFeedPage/SaveJob.svg";
import LocationIcon from "/JobFeedPage/Location.svg";
import ExperienceIcon from "/JobFeedPage/Experience.svg";

const JobCard = (props) => {
  return (
    <div className="card-container w-[395px] md:w-[340px] xl:w-[445px] space-y-[14px]">
      <div className="flex justify-between items-start">
        <div className="flex">
          <img src={props.companyLogo} alt="company logo" className="mr-2" />
          <h1 className="job-title">{props.jobTitle}</h1>
        </div>
        <img src={SaveJob} alt="save icon" />
      </div>
      <ul className="job-details text-[#9894A7] space-y-2">
        <li>{props.companyName}</li>
        <li>
          <img src={LocationIcon} alt="location icon" className="mr-2" />
          {props.experienceReq}
        </li>
        <li>
          <img src={ExperienceIcon} alt="experience icon" className="mr-2" />
          {props.location}
        </li>
        <li>{props.datePosted}</li>
      </ul>
    </div>
  );
};

export default JobCard;
