/**
 * Component for creating a job posting.
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.closeCreateJobCard - Function to close the job creation form
 */
import { useEffect, useState } from "react";
// import NavBar from "../Common/Navbar";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const CreateJobCard = ({ fetchPostedJobs, closeCreateJobCard }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const token = user?.token;

  /**
   * State to manage job form data.
   * @type {Object}
   */
  const [job, setJob] = useState({
    title: "",
    location: "",
    industry: "",
    jobType: "Full-time",
    experienceLevel: "0-3 Months",
    workplaceType: "On-site",
    startDate: "",
    endDate: "",
    salaryRange: { min: "", max: "" },
    frequency: "Per Year",
    description: "",
  });

  /**
   * Clears all form fields.
   */
  const clearAllFields = () => {
    setJob({
      title: "",
      location: "",
      industry: "",
      jobType: "Full-time",
      experienceLevel: "0-3 Months",
      workplaceType: "On-site",
      startDate: "",
      endDate: "",
      salaryRange: { min: "", max: "" },
      frequency: "Per Year",
      description: "",
    });
  };
  /**
   * Handles input change for job details.
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  /**
   * Handles salary range input change.
   * @param {Event} e - Input change event
   */
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      salaryRange: { ...prev.salaryRange, [name]: value },
    }));
  };
  /**
   * Handles job form submission.
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : null;

    // Validation: Prevent links in the description
    const linkRegex = /https?:\/\/|www\.|ftp:\/\//i;
    if (linkRegex.test(job.description)) {
      return toast.error("Links are not allowed in the description.");
    }

    try {
      const companyName = user?.authenticatedUser?.companyName;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createJob}`,
        {
          ...job,
          companyName,
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      clearAllFields();
      closeCreateJobCard();
      fetchPostedJobs();
    } catch (error) {
      toast.error(error.response?.data?.msg);
      // console.log(error.response?.data?.error);
    }
  };
  /**
   * Redirects user to login page if no authentication token is found.
   */
  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue...");
      navigate("/EmpSignUp");
    }
  }, []);

  return (
    <>
      {/* <NavBar isEduHero={true} /> */}
      <div className="w-screen h-screen flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg border border-gray-300"
        >
          <h2 className="text-2xl font-semibold mb-4">Create Job</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-2">
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter job title"
                  value={job.title}
                  onChange={handleChange}
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={job.location}
                  onChange={handleChange}
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Job Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  placeholder="Enter category (e.g IT)"
                  value={job.industry}
                  onChange={handleChange}
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Paid Internship">Paid Internship</option>
                  <option value="Unpaid Internship">Unpaid Internship</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Job Shadow">Job Shadow</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="experienceLevel"
                  value={job.experienceLevel}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="0-3 Months">0-3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="6-12 Months">6-12 Months</option>
                  <option value="1 Year+">1 Year+</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Workplace Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="workplaceType"
                  value={job.workplaceType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="set-date flex justify-between items-center">
                <div>
                  <label className="block font-semibold text-[#777585] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={job.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#777585] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={job.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    min={job.startDate} // Ensures the end date is after the start date
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Salary Range <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="$ Min Salary"
                    value={job.salaryRange.min}
                    onChange={handleSalaryChange}
                    className="w-1/2 p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    name="max"
                    placeholder="$ Max Salary"
                    value={job.salaryRange.max}
                    onChange={handleSalaryChange}
                    className="w-1/2 p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={job.frequency}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Per Year">Per Year</option>
                  <option value="Per Month">Per Month</option>
                  <option value="Per Hour">Per Hour</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block font-semibold text-[#777585] mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter job description"
                  value={job.description}
                  onChange={handleChange}
                  className="border p-2 w-full rounded mb-1 h-24"
                  maxLength="1000"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-6 flex space-x-6">
            <button
              onClick={closeCreateJobCard}
              className="w-1/2 px-6 py-2 border-2 border-purple-600 rounded font-semibold text-purple-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateJobCard;
