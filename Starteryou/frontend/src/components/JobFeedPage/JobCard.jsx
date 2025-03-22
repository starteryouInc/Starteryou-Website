/**
 * JobCard Component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.createdAt - Job posting date in ISO format
 * @returns {JSX.Element} A job card displaying job details with icons and time formatting.
 */
// import SaveJob from "/JobFeedPage/SaveJob.svg";
import LocationIcon from "/JobFeedPage/Location.svg";
import ExperienceIcon from "/JobFeedPage/Experience.svg";
import { FaBuilding, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { formatDistanceToNow, differenceInDays } from "date-fns";
// import componayLogo from "/JobFeedPage/CompanyLogo.svg";

const JobCard = ({ jobs, newSavedJobs }) => {
  const isBookmarked = newSavedJobs.some(
    (savedJob) => savedJob._id === jobs._id
  );
  /**
   * Calculates the time since the job was posted.
   * @param {string} isoDateString - The ISO date string of the job posting.
   * @returns {string} The formatted time difference (e.g., "3 days ago").
   */
  const timeAgo = (isoDateString) => {
    return formatDistanceToNow(new Date(isoDateString), { addSuffix: true });
  };
  /**
   * Determines if the applicant is early based on job posting date.
   * @param {string} createdAt - The job posting date in ISO format.
   * @returns {boolean} True if the job was posted less than 7 days ago, otherwise false.
   */
  const isEarlyApplicant = (createdAt) => {
    const daysDifference = differenceInDays(new Date(), new Date(createdAt));
    return daysDifference < 7;
  };
  return (
    <div className="card-container w-[395px] md:w-[340px] xl:w-[445px] space-y-[14px]">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="bg-gray-200 p-3 rounded-lg">
            <FaBuilding className="text-2xl text-gray-700" />
          </div>
          <h1 className="job-title ml-3">{jobs.title}</h1>
        </div>
        {isBookmarked ? (
          <FaBookmark className="text-xl text-[#6A54DF]" />
        ) : (
          <FaRegBookmark className="text-xl" />
        )}
      </div>
      <ul className="job-details text-[#9894A7] space-y-2">
        <li>{jobs.companyName ? jobs.companyName : "Unknown"}</li>
        <li>
          <img src={ExperienceIcon} alt="experience icon" className="mr-2" />
          Experience Level: {jobs.experienceLevel}
        </li>
        <li>
          <img src={LocationIcon} alt="location icon" className="mr-2" />
          {jobs.location}
        </li>
        {isEarlyApplicant(jobs.createdAt) && (
          <li className="bg-green-100 text-green-500 py-1 px-3 rounded-md w-fit">
            Early Applicant
          </li>
        )}
        <li className="capitalize">{timeAgo(jobs.createdAt)}</li>
      </ul>
    </div>
  );
};

export default JobCard;
