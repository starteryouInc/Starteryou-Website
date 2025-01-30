import React, { useState } from "react";

const CreateJobCard = () => {
  const [job, setJob] = useState({
    title: "",
    companyName: "",
    location: "",
    industry: "",
    jobType: "Full-time",
    experienceLevel: "Entry",
    salaryRange: { min: "", max: "" },
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="w-full max-w-md p-8 mx-4 shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-xl font-bold">Create Job</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={job.companyName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={job.industry}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="jobType"
          value={job.jobType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
        </select>
        <select
          name="experienceLevel"
          value={job.experienceLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Entry</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>
        <div className="flex space-x-2">
          <input
            type="number"
            name="min"
            placeholder="Min Salary"
            value={job.salaryRange.min}
            onChange={(e) =>
              setJob((prev) => ({
                ...prev,
                salaryRange: { ...prev.salaryRange, min: e.target.value },
              }))
            }
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            name="max"
            placeholder="Max Salary"
            value={job.salaryRange.max}
            onChange={(e) =>
              setJob((prev) => ({
                ...prev,
                salaryRange: { ...prev.salaryRange, max: e.target.value },
              }))
            }
            className="w-1/2 p-2 border rounded"
          />
        </div>
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
          Post Job
        </button>
      </div>
    </div>
  );
};

export default CreateJobCard;
