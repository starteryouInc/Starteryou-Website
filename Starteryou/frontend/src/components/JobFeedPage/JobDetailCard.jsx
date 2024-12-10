import React from "react";
import SaveJob from "/JobFeedPage/SaveJob.svg";
import LocationIcon from "/JobFeedPage/Location.svg";
import ExperienceIcon from "/JobFeedPage/Experience.svg";
import MissingSkillsIcon from "/JobFeedPage/Missing.svg";

const JobDetailCard = ({ jobDetails, onClose }) => {
  return (
    <div className="card-detailed-container lg:h-[995px] md:w-[400px] lg:w-[640px] space-y-[14px]">
      <div className="flex items-center justify-between">
        <img src={jobDetails.compImgSrc} alt="" />
        <button className="text-4xl md:hidden" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="flex justify-between items-start">
        <h1 className="text-xl font-semibold">{jobDetails.jobTitle}</h1>
        <img src={SaveJob} alt="save icon" />
      </div>
      <ul className="text-[#9894A7] space-y-2">
        <li>{jobDetails.compName}</li>
        <li>Early Applicant {jobDetails.datePosted}</li>
        <li>
          <img src={LocationIcon} alt="location icon" className="mr-2" />
          {jobDetails.experience}
        </li>
        <li>
          <img src={ExperienceIcon} alt="experience icon" className="mr-2" />
          {jobDetails.jobLocation}
        </li>
        <li>
          <img
            src={MissingSkillsIcon}
            alt="missing skills icon"
            className="mr-2"
          />
          5 skills missing in your profile
        </li>
      </ul>
      <button className="apply-btn w-[92px] h-[38px] rounded-[8px] bg-[#6A54DF] text-white text-[14px] font-semibold leading-4">
        Apply Now
      </button>
      <div className="job-description-container">
        <h2 className="my-8 text-2xl font-semibold leading-7">
          Job Description
        </h2>
        <h5 className="mb-2 text-lg font-semibold leading-5">
          Required Skills and Experience:{" "}
        </h5>
        <h4 className="text-[#777485]">
          {jobDetails.jobDescription}
          <ul className="my-4 space-y-4">
            <li>Regards</li>
            <li>Infosys BPM Talent Acquisition Team</li>
            <li>More Info</li>
            <li>Job Type: Permanent Job</li>
          </ul>
        </h4>
      </div>
      <span className="text-[#777485] font-semibold space-x-2">
        Looking for similar opportunities? Click here to explore more jobs like
        this!
        <button className="similar-job-btn ml-2 text-[#6A54DF] font-semibold">
          Similar Jobs.
        </button>
      </span>
    </div>
  );
};

export default JobDetailCard;
