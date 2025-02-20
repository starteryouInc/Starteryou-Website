/**
 * JobDetailCard Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.jobDetails - Job details data
 * @param {Function} props.onClose - Function to close the job detail card
 * @param {boolean} props.savedJob - Boolean indicating if the job is saved
 * @returns {JSX.Element} A detailed job card with job information, save functionality, and application option.
 */
import React, { useState } from "react";
// import SaveJob from "/JobFeedPage/SaveJob.svg";
import LocationIcon from "/JobFeedPage/Location.svg";
import ExperienceIcon from "/JobFeedPage/Experience.svg";
import MissingSkillsIcon from "/JobFeedPage/Missing.svg";
import componayLogo from "/JobFeedPage/CompanyLogo.svg";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { differenceInDays, format } from "date-fns";
import { useUserContext } from "../../context/UserContext";
import ApplyJobCard from "../JobFeedPage/ApplyJobCard";

const JobDetailCard = ({ jobDetails, onClose, savedJob }) => {
  const { user } = useUserContext();
  const role = user?.authenticatedUser?.role;
  const [openApplyJob, setOpenApplyJob] = useState(false);
  /**
   * Determines if the applicant is an early applicant based on job posting date.
   * @param {string} createdAt - The job posting date in ISO format.
   * @returns {boolean} True if the job was posted less than 7 days ago, otherwise false.
   */
  const isEarlyApplicant = (createdAt) => {
    const daysDifference = differenceInDays(new Date(), new Date(createdAt));
    return daysDifference < 7;
  };
  /**
   * Formats the salary range into a readable string.
   * @param {Object} salaryRange - Salary range object containing min and max values.
   * @param {number} salaryRange.min - Minimum salary value.
   * @param {number} salaryRange.max - Maximum salary value.
   * @returns {string} Formatted salary range (e.g., "$50,000 - $70,000") or "N/A" if data is missing.
   */
  const formatSalaryRange = (salaryRange) => {
    if (!salaryRange || !salaryRange.min || !salaryRange.max) return "N/A";
    const { min, max } = salaryRange;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  /**
   * Formats a date string into "dd MMMM yyyy" format.
   * @param {string} dateString - The date string in ISO format.
   * @returns {string} Formatted date (e.g., "10 October 2023") or an empty string if no date is provided.
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMMM yyyy");
  };

  return (
    <>
      <div className="card-detailed-container lg:h-[995px] md:w-[400px] lg:w-[640px] space-y-[14px]">
        <div className="flex items-center justify-between">
          <img
            src={jobDetails.compImgSrc ? jobDetails.compImgSrc : componayLogo}
            alt=""
          />
          <button className="text-4xl md:hidden" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-semibold">{jobDetails.title}</h1>
          <FaRegBookmark
            className="cursor-pointer"
            onClick={() => savedJob(jobDetails._id)}
          />
        </div>
        <ul className="text-[#9894A7] space-y-2">
          <li>{jobDetails.companyName ? jobDetails.companyName : "Unknown"}</li>
          {isEarlyApplicant(jobDetails.createdAt) && (
            <li className="bg-green-100 text-green-500 py-1 px-3 rounded-md w-fit">
              Be an early applicant
            </li>
          )}
          <li>
            <img src={ExperienceIcon} alt="experience icon" className="mr-2" />
            Experience Level: {jobDetails.experienceLevel}
          </li>
          <li>
            <img src={LocationIcon} alt="location icon" className="mr-2" />
            {jobDetails.location}
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

        {role === "jobSeeker" && (
          <button
            onClick={() => setOpenApplyJob(true)}
            className="apply-btn w-[92px] h-[38px] rounded-[8px] bg-[#6A54DF] text-white text-[14px] font-semibold leading-4"
          >
            Apply Now
          </button>
        )}
        <div className="job-description-container">
          <h2 className="my-8 text-2xl font-semibold leading-7">
            Job Description
          </h2>
          <h5 className="mb-2 text-lg font-semibold leading-5">
            Required Skills and Experience:{" "}
          </h5>
          <h4 className="text-[#777485]">
            {jobDetails.description}
            <ul className="my-4 space-y-4">
              <li>Regards</li>
              <li>{jobDetails.companyName} Talent Acquisition Team</li>
              <li>More Info</li>
              {jobDetails.startDate && (
                <li>Start Date: {formatDate(jobDetails.startDate)}</li>
              )}
              <li>Job Type: {jobDetails.jobType}</li>
              <li>Workplace Type: {jobDetails.workplaceType}</li>
              <li>
                Expected Salary:{" "}
                {jobDetails.salaryRange
                  ? `${formatSalaryRange(jobDetails.salaryRange)} / ${
                      jobDetails.frequency
                    }`
                  : "N/A"}
              </li>
            </ul>
          </h4>
        </div>
        <span className="text-[#777485] font-semibold space-x-2">
          Looking for similar opportunities? Click here to explore more jobs
          like this!
          <button className="similar-job-btn ml-2 text-[#6A54DF] font-semibold">
            Similar Jobs.
          </button>
        </span>
      </div>
      {openApplyJob && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
       justify-center z-50 overflow-y-scroll"
        >
          <ApplyJobCard
            jobID={jobDetails._id}
            closeApplyJob={() => setOpenApplyJob(false)}
          />
        </div>
      )}
    </>
  );
};

export default JobDetailCard;
