import { useState } from "react";
import { format } from "date-fns";
import { LuBuilding } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { HiSpeakerphone } from "react-icons/hi";
import EditJobCard from "../JobFeedPage/EditJobCard";

/**
 * JobDetailedCard2 Component
 * Displays detailed information about a job posting, including applicants, views, engagement rate,
 * job description, requirements, benefits, and an option to edit or close the job.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.job - Job details object
 * @param {Function} props.getPostedJobs - Function to refresh job postings
 * @param {Function} props.deleteJobFunction - Function to delete a job posting
 * @returns {JSX.Element} The JobDetailedCard2 component
 */
const JobDetailedCard2 = ({ job, getPostedJobs, deleteJobFunction, closeJobDetailedCard2 }) => {
  const [openEditJobCard, setOpenEditJobCard] = useState(false);

  /**
   * Formats the salary range.
   * @param {Object} salaryRange - Salary range object
   * @param {number} salaryRange.min - Minimum salary
   * @param {number} salaryRange.max - Maximum salary
   * @returns {string} Formatted salary range string
   */
  const formatSalaryRange = (salaryRange) => {
    if (!salaryRange || !salaryRange.min || !salaryRange.max) return "N/A";
    const { min, max } = salaryRange;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  /**
   * Formats a date string.
   * @param {string} dateString - Date string
   * @returns {string} Formatted date string (dd MMMM yyyy)
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMMM yyyy");
  };
  return (
    <div className="w-[1200px] mx-auto bg-white p-6 rounded-lg">
      <div className="p-4 flex justify-between items-center rounded-md border-2">
        <div className="flex items-center space-x-4">
          <figure className="h-14 w-14 bg-[#e1fcff] rounded-lg">
            <img src="" alt="" />
          </figure>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{job.title}</h2>
            <p className="text-gray-500">
              {job.companyName}. - {job.location}
              <span className="bg-gray-200 text-gray-700 ml-4 px-2 py-1 text-sm rounded-md">
                Active
              </span>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="border px-4 py-2 rounded-md">Applicants</button>
          <button
            onClick={() => setOpenEditJobCard(true)}
            className="border px-4 py-2 rounded-md"
          >
            Edit Job
          </button>
          <button
            onClick={() => deleteJobFunction(job._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Close Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-4">
        <div className="p-4 rounded-md border-2">
          <div className="flex items-center space-x-4">
            <span className="bg-[#e1fcff] text-[#0da2e7] h-8 w-8 flex items-center justify-center rounded-lg">
              <GoPeople className="text-xl" />
            </span>
            <div>
              <p className="text-gray-600">Total Applicants</p>
              <p className="text-lg font-semibold">45</p>
            </div>
          </div>
          <div className="w-full mt-2 bg-gray-300 h-2 rounded overflow-hidden">
            <div className="bg-blue-500 h-2" style={{ width: "45%" }}></div>
          </div>
        </div>

        <div className="p-4 rounded-md border-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#e1fcff] text-[#0da2e7] h-8 w-8 flex items-center justify-center rounded-lg">
              <MdOutlineRemoveRedEye className="text-xl" />
            </span>
            <div>
              <p className="text-gray-600">Job Views</p>
              <p className="text-lg font-semibold">238</p>
            </div>
          </div>
          <div className="w-full mt-2 bg-gray-300 h-2 rounded overflow-hidden">
            <div className="bg-blue-500 h-2" style={{ width: "70%" }}></div>
          </div>
        </div>
        <div className="p-4 rounded-md border-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#e1fcff] text-[#0da2e7] h-8 w-8 flex items-center justify-center rounded-lg">
              <IoAnalyticsOutline className="text-xl" />
            </span>
            <div>
              <p className="text-gray-600">Engagement Rate</p>
              <p className="text-lg font-semibold">18.9%</p>
            </div>
          </div>
          <div className="w-full mt-2 bg-gray-300 h-2 rounded overflow-hidden">
            <div className="bg-blue-500 h-2" style={{ width: "20%" }}></div>
          </div>
        </div>
      </div>

      <div className="divide-section w-full flex items-start justify-between space-x-4">
        <div className="left-section w-full">
          <div className="mb-4 p-4 border-2 rounded-md">
            <h3 className="font-semibold text-lg">About the Role</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div className="my-4 p-4 border-2 rounded-md">
            <h3 className="font-semibold text-lg">Requirements</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                {job.experienceLevel} is the experience level required for the
                job.
              </li>
              {job.workplaceType && (
                <li>{job.workplaceType} will the work place type.</li>
              )}
              {job.startDate && (
                <li>Starting date will be: {formatDate(job.startDate)}</li>
              )}
            </ul>
          </div>

          <div className="my-4 p-4 border-2 rounded-md">
            <h3 className="font-semibold text-lg">Benefits</h3>
            <p className="text-gray-500">
              (Details about benefits can go here)
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="flex flex-col justify-between items-center space-y-4">
            <div className="w-[450px] p-4 bg-[#f7e4d7] rounded-md flex flex-col justify-center space-y-4">
              <h3 className="flex items-center font-semibold text-lg">
                <HiSpeakerphone className="text-orange-500 mr-2" />
                Promote this Job
              </h3>
              <p className="text-[#a0a2a9] mx-3">
                Boost your job post visibility and reach 3x more qualified
                candidates.
              </p>
              <button className="mt-2 w-full bg-orange-500 text-[#f7e4d7] px-4 py-2 rounded">
                Boost Now
              </button>
            </div>

            <div className="w-[450px] p-4 rounded-md border-2 text-gray-600 space-y-4">
              <h3 className="font-semibold text-lg">Key Details</h3>
              <p className="flex items-center space-x-2">
                <LuBuilding className="text-2xl text-[#aaadb4]" />
                <p className="flex flex-col">
                  <span className="text-[#aaadb4]">Industry</span>
                  <strong>{job.industry}</strong>
                </p>
              </p>
              <p className="flex items-center space-x-2">
                <CiCalendar className="text-2xl text-[#aaadb4]" />
                <p className="flex flex-col">
                  <span className="text-[#aaadb4]">Job Type</span>
                  <strong>{job.jobType}</strong>
                </p>
              </p>
              <p className="flex items-center space-x-2">
                <BsCurrencyDollar className="text-2xl text-[#aaadb4]" />
                <p className="flex flex-col">
                  <span className="text-[#aaadb4]">Salary Range</span>
                  <strong>
                    {formatSalaryRange(job.salaryRange)} / {job.frequency}
                  </strong>
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>
      {openEditJobCard && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
        justify-center z-50 overflow-hidden"
        >
          <EditJobCard
            editJob={job}
            getPostedJobs={getPostedJobs}
            closeEditJobCard={() => setOpenEditJobCard(false)}
            closeJobDetailedCard2={closeJobDetailedCard2}
          />
        </div>
      )}
    </div>
  );
};

export default JobDetailedCard2;
