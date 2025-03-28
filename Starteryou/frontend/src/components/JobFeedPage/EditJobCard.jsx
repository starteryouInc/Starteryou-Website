import { useEffect, useState } from "react";
// import NavBar from "../Common/Navbar";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const EditJobCard = ({
  closeEditJobCard,
  editJob,
  getPostedJobs,
  closeDetailedCard2,
}) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const token = user?.token;
  const [job, setJob] = useState({
    title: editJob.title,
    location: editJob.location,
    industry: editJob.industry,
    jobType: editJob.jobType,
    experienceLevel: editJob.experienceLevel,
    workplaceType: editJob.workplaceType,
    startDate: "",
    endDate: "",
    salaryRange: { min: editJob.salaryRange.min, max: editJob.salaryRange.max },
    frequency: editJob.frequency,
    description: editJob.description,
  });

  const clearAllFields = () => {
    setJob({
      title: "",
      location: "",
      industry: "",
      jobType: "Full-time",
      experienceLevel: "Entry",
      workplaceType: "On-site",
      startDate: "",
      endDate: "",
      salaryRange: { min: "", max: "" },
      frequency: "Per Year",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      salaryRange: { ...prev.salaryRange, [name]: value },
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : null;

    // Validation: Prevent links in the description
    const linkRegex = /https?:\/\/|www\.|ftp:\/\//i;
    if (linkRegex.test(job.description)) {
      return toast.error("Links are not allowed in the description.");
    }

    try {
      const { data } = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateJob(editJob._id)}`,
        {
          ...job,
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
      closeEditJobCard();
      closeDetailedCard2();
      getPostedJobs();
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  //   useEffect(() => {
  //     if (!token) {
  //       toast.error("Please login to continue...");
  //       navigate("/EmpSignUp");
  //     }
  //   }, []);

  return (
    <>
      {/* <NavBar isEduHero={true} /> */}
      <div className="w-screen h-screen flex justify-center items-center">
        <form
          onSubmit={handleEditSubmit}
          className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-lg border border-gray-300"
        >
          <h2 className="text-2xl font-semibold mb-4">Edit Job</h2>
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
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  onChange={handleChange}
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
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  value={job.location}
                  onChange={handleChange}
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
                  pattern={
                    "^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\\"'<>\\?/\\\\|^~`]+$"
                  }
                  title="Only alphabets and spaces are allowed."
                  onChange={handleChange}
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
              <div className="set-date grid grid-cols-2 gap-4">
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
                    min={job.startDate}
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
                    min={job.salaryRange.min || 0} // Ensures max is not less than min
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
              <div className="flex-1 flex flex-col space-y-2">
                <label className="font-semibold text-[#777585]">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter job description"
                  value={job.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 w-full rounded-md h-48 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="1000"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-6 flex space-x-6">
            <button
              onClick={closeEditJobCard}
              className="w-1/2 px-6 py-2 border-2 border-purple-600 rounded font-semibold text-purple-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditJobCard;
