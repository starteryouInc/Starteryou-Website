import React, { useState } from "react";

const WorkExperienceForm = ({ openWorkForm }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    isCurrentCompany: true,
    startYear: "",
    startMonth: "",
    noticePeriod: "",
    workplace: "In-Office",
    employmentType: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? checked : value,
    });
  };

  const clearAllFields = () => {
    setFormData({
      jobTitle: "",
      companyName: "",
      isCurrentCompany: true,
      startYear: "",
      startMonth: "",
      noticePeriod: "",
      workplace: "In-Office",
      employmentType: "",
      salary: "",
      description: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearAllFields();
    console.log("Form Data Submitted:", formData);
  };

  const handleCancel = () => {
    console.log("Form Canceled");
    clearAllFields();
    openWorkForm();
  };

  return (
    <form
      className="p-8 mx-4 bg-white border rounded-[18px] max-w-3xl md:w-[560px] xl:w-[760px]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold mb-6">Work Experience</h1>

      {/* Current Job Title */}
      <label className="block font-semibold text-[#777585] mb-2">
        Current Job Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="Most recent job title"
        className="border p-2 w-full mb-4 rounded"
        required
      />

      {/* Company Name */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Company Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Most recent company"
        className="border p-2 w-full mb-4 rounded"
        required
      />

      {/* Is This Your Current Company? */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Is This Your Current Company
      </label>
      <div className="mb-4">
        <label className="mr-4 ">
          <input
            type="radio"
            name="isCurrentCompany"
            checked={formData.isCurrentCompany}
            onChange={() =>
              setFormData({ ...formData, isCurrentCompany: true })
            }
            className="mr-1"
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="isCurrentCompany"
            checked={!formData.isCurrentCompany}
            onChange={() =>
              setFormData({ ...formData, isCurrentCompany: false })
            }
            className="mr-1"
          />
          No
        </label>
      </div>

      {/* Start Date */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Start Date <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-4 mb-4">
        <select
          name="startYear"
          value={formData.startYear}
          onChange={handleChange}
          className="border p-2 rounded w-1/2"
          required
        >
          <option value="">Year</option>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={2024 - i}>
              {2024 - i}
            </option>
          ))}
        </select>
        <select
          name="startMonth"
          value={formData.startMonth}
          onChange={handleChange}
          className="border p-2 rounded w-1/2"
          required
        >
          <option value="">Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Notice Period */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Notice Period <span className="text-red-500">*</span>
      </label>
      <select
        name="noticePeriod"
        value={formData.noticePeriod}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
        required
      >
        <option value="">Select your notice period</option>
        <option value="1 Month">1 Month</option>
        <option value="2 Months">2 Months</option>
        <option value="3 Months">3 Months</option>
      </select>

      {/* Workplace */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Workplace
      </label>
      <div className="mb-4">
        {["In-Office", "Hybrid", "Work from home"].map((option) => (
          <label key={option} className="mr-4">
            <input
              type="radio"
              name="workplace"
              value={option}
              checked={formData.workplace === option}
              onChange={handleChange}
              className="mr-1"
            />
            {option}
          </label>
        ))}
      </div>

      {/* Employment Type */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Employment Type
      </label>
      <select
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">Select your employment type</option>
        <option value="Full-Time">Full-Time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Contract">Contract</option>
      </select>

      {/* Current Salary */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Current Salary (Annually) <span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-2 mb-4">
        <select className="border p-2 rounded w-1/4" disabled>
          <option>INR</option>
        </select>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Enter your current salary"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Description */}
      <label className="block font-semibold text-[#777585]  mb-2">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter your description"
        className="border p-2 w-full rounded mb-1 h-24"
        maxLength="1000"
      />
      <span>Max.1000/1000 character</span>

      {/* Buttons */}
      <div className="flex mt-4 space-x-4">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="text-purple-600 px-6 py-2 rounded hover:text-purple-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WorkExperienceForm;
