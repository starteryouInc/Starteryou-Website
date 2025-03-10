import React, { useState } from "react";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import axios from "axios";
import { toast } from 'react-hot-toast';

const WorkExperienceForm = ({ openWorkForm, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    isCurrentCompany: false,
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
    description: "",
  });

  // Function to clear all fields
  const clearAllFields = () => {
    setFormData({
      jobTitle: "",
      companyName: "",
      isCurrentCompany: true,
      startYear: "",
      startMonth: "",
      endYear: "",
      endMonth: "",
      description: "",
    });
  };

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
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addWorkExperience(
          userId
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
      clearAllFields();
      openWorkForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    clearAllFields();
    openWorkForm();
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
WorkExperienceForm.metadata = {
  componentName: "WorkExperienceForm",
  description:
    "A form component for adding work experience details, including job title, company name, start and end dates, and description.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to submit work experience
    inputValidation: true, // Validates required fields before submission
    toastNotifications: true, // Provides feedback on submission success or failure
    clearForm: true, // Clears form fields after successful submission
  },
  data: {
    initialContent: {
      jobTitle: "", // Job title input
      companyName: "", // Company name input
      isCurrentCompany: false, // Indicates if the job is current
      startYear: "", // Year of starting the job
      startMonth: "", // Month of starting the job
      endYear: "", // Year of ending the job (if applicable)
      endMonth: "", // Month of ending the job (if applicable)
      description: "", // Description of the job
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    requiredFields: "Indicates required fields with asterisks.",
    clearButton: "Allows clearing all fields easily.",
  },
  styles: {
    container: {
      padding: "2rem", // Padding for the main container
      backgroundColor: "white", // Background color for the component
      borderRadius: "0.5rem", // Rounded corners for the form
    },
    title: {
      fontSize: "2rem", // Font size for the title
      fontWeight: "bold", // Font weight for the title
    },
    input: {
      border: "1px solid #ccc", // Border for input fields
      padding: "0.5rem", // Padding inside input fields
      borderRadius: "0.25rem", // Rounded corners for input fields
    },
    label: {
      color: "#777585", // Color for labels
      fontWeight: "600", // Font weight for labels
    },
  },
  apiEndpoints: {
    addWorkExperience: {
      method: "POST",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addWorkExperience(":userId")}`, // Endpoint for adding work experience
      description: "Adds a new work experience entry for the authenticated user.",
      requestBody: {
        userId: "string", // The ID of the user
        companyName: "string", // Name of the company
        jobTitle: "string", // Job title of the user
        startDate: "Date", // Start date of the work experience
        endDate: "Date|null", // End date of the work experience (null if current)
        description: "string", // Description of the work experience
      },
      successResponse: {
        status: 200,
        message: "Work experience added successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while adding work experience.",
      },
    },
  },
};
export default WorkExperienceForm;
