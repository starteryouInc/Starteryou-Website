import React, { useEffect, useState } from "react";
import NavBar from "../Common/Navbar";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../config/api";
import { toast } from "react-toastify";
import axios from "axios";

const CreateJobCard = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const token = user?.token;
  const [job, setJob] = useState({
    title: "",
    location: "",
    industry: "",
    jobType: "Full-time",
    experienceLevel: "Entry",
    salaryRange: { min: "", max: "" },
    description: "",
  });

  const clearAllFields = () => {
    setJob({
      title: "",
      location: "",
      industry: "",
      jobType: "Full-time",
      experienceLevel: "Entry",
      salaryRange: { min: "", max: "" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const companyName = user?.authenticatedUser?.companyName;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.createJob}`,
        {
          ...job,
          companyName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      clearAllFields();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue...");
      navigate("/EmpSignUp");
    }
  }, []);

  return (
    <>
      <NavBar isEduHero={true} />
      <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mt-20 p-6 bg-white shadow-lg rounded-lg border border-gray-300"
        >
          <h2 className="text-2xl font-semibold mb-6">Create Job</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
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
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[#777585] mb-2">
                  Salary Range <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min Salary"
                    value={job.salaryRange.min}
                    onChange={handleSalaryChange}
                    className="w-1/2 p-2 mb-4 border rounded"
                    required
                  />
                  <input
                    type="number"
                    name="max"
                    placeholder="Max Salary"
                    value={job.salaryRange.max}
                    onChange={handleSalaryChange}
                    className="w-1/2 p-2 mb-4 border rounded"
                    required
                  />
                </div>
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
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 font-semibold"
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
