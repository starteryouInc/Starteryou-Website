import React, { useState } from "react";
import { API_CONFIG } from "../../../../config/api";
import { useUserContext } from "../../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";

const EditWork = ({ closeEditWork, job, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;

  // Function to formate the dates coming from the db according to their respective fields
  const formatDate = (dateString) => {
    if (!dateString) return { year: "", month: "" }; // Handle missing date
    const date = new Date(dateString);
    return {
      year: date.getFullYear().toString(), // Extract year
      month: (date.getMonth() + 1).toString().padStart(2, "0"), // Extract month (0-based index)
    };
  };

  const startDate = formatDate(job.startDate);
  const endDate = formatDate(job.endDate);

  const [formData, setFormData] = useState({
    jobTitle: job.jobTitle,
    companyName: job.companyName,
    isCurrentCompany: job.endDate ? false : true,
    startYear: startDate.year,
    startMonth: startDate.month,
    endYear: endDate.year,
    endMonth: endDate.month,
    description: job.description,
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.jobTitle ||
      !formData.startYear ||
      !formData.startMonth
    ) {
      return toast.error("Please fill out all required fields.");
    }

    // Construct startDate and endDate
    const startDate = new Date(
      `${formData.startYear}-${formData.startMonth}-01`
    );
    const endDate =
      !formData.isCurrentCompany && formData.endYear && formData.endMonth
        ? new Date(`${formData.endYear}-${formData.endMonth}-01`)
        : null;

    // Validation: endDate is not earlier than startDate
    if (endDate && endDate < startDate) {
      return toast.error("End date cannot be earlier than start date.");
    }

    // Validation: Prevent links in the description
    const linkRegex = /https?:\/\/|www\.|ftp:\/\//i;
    if (linkRegex.test(formData.description)) {
      return toast.error("Links are not allowed in the description.");
    }

    // Prepare the data in the required schema
    const workExperience = {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      startDate,
      endDate,
      description: formData.description || "",
    };

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateWorkExperience(
          userId,
          job._id
        )}`,
        workExperience,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
      closeEditWork();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    closeEditWork();
  };

  return (
    <form
      className="p-8 mx-4 bg-white border rounded-lg max-w-3xl md:w-[560px] xl:w-[760px]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-semibold mb-6">Work Experience</h1>

      {/* Job Title */}
      <label className="block font-semibold text-[#777585] mb-2">
        Job Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="Most recent job title"
        className="border p-2 w-full mb-4 rounded"
        pattern={'^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\"\'<>\\?/\\\\|^~`]+$'} 
        title="Only alphabets and spaces are allowed."
        required
      />

      {/* Company Name */}
      <label className="block font-semibold text-[#777585] mb-2">
        Company Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company name"
        className="border p-2 w-full mb-4 rounded"
        required
      />

      {/* Is Current Company */}
      <label className="block font-semibold text-[#777585] mb-2">
        Is This Your Current Company
      </label>
      <div className="mb-4">
        <label className="mr-4">
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
      <label className="block font-semibold text-[#777585] mb-2">
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
          {Array.from({ length: 50 }, (_, i) => (
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
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ].map((month, i) => (
            <option key={i} value={month}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* End Date */}
      {!formData.isCurrentCompany && (
        <>
          <label className="block font-semibold text-[#777585] mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4 mb-4">
            <select
              name="endYear"
              value={formData.endYear}
              onChange={handleChange}
              className="border p-2 rounded w-1/2"
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 50 }, (_, i) => (
                <option key={i} value={2024 - i}>
                  {2024 - i}
                </option>
              ))}
            </select>
            <select
              name="endMonth"
              value={formData.endMonth}
              onChange={handleChange}
              className="border p-2 rounded w-1/2"
              required
            >
              <option value="">Month</option>
              {[
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
              ].map((month, i) => (
                <option key={i} value={month}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Description */}
      <label className="block font-semibold text-[#777585] mb-2">
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

export default EditWork;
