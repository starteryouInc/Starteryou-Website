import React, { useState } from "react";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";

const EducationalDetailsForm = ({ openEducationForm, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;

  const [formData, setFormData] = useState({
    qualification: "",
    specialization: "",
    institute: "",
    marks: "",
    startYear: "",
    passingYear: "",
    description: "",
  });

  // Function to clear all fields
  const clearAllFields = () => {
    setFormData({
      qualification: "",
      specialization: "",
      institute: "",
      marks: "",
      startYear: "",
      passingYear: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "marks" ? parseFloat(value) || "" : value, // Ensure marks is a number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.qualification || !formData.institute || !formData.startYear) {
      return toast.error("Please fill out all required fields.");
    }

    const startDate = new Date(`${formData.startYear}-01-01`);
    const endDate = formData.passingYear
      ? new Date(`${formData.passingYear}-01-01`)
      : "Present";

    // Validation: endDate is not earlier than startDate
    if (endDate && endDate < startDate) {
      return toast.error("End date cannot be earlier than start date.");
    }

    // Validation: Prevent links in the description
    const linkRegex = /https?:\/\/|www\.|ftp:\/\//i;
    if (linkRegex.test(formData.description)) {
      return toast.error("Links are not allowed in the description.");
    }

    const educationDetails = {
      institution: formData.institute,
      degree: formData.qualification,
      specialization: formData.specialization,
      startYear: startDate,
      endYear: endDate,
      Marks: formData.marks,
      description: formData.description || "",
    };

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addEducation(userId)}`,
        educationDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
      clearAllFields();
      openEducationForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  const handleCancel = () => {
    clearAllFields();
    openEducationForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 mx-4 bg-white border rounded-lg max-w-3xl md:w-[560px] xl:w-[760px]"
    >
      <h2 className="text-2xl font-semibold mb-4">Educational Details</h2>

      {/* Qualification */}
      <label className="block font-semibold text-[#777585] mb-2">
        Qualification <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        placeholder="Most recent Qualification"
        className="border p-2 w-full mb-4 rounded"
        pattern={'^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\"\'<>\\?/\\\\|^~`]+$'} 
        title="Only alphabets and spaces are allowed."
        required
      />

      {/* Specialization */}
      <label className="block font-semibold text-[#777585] mb-2">
        Specialization
      </label>
      <input
        type="text"
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        placeholder="Enter the specialisation, if have"
        className="border p-2 w-full mb-4 rounded"
        pattern={'^[A-Za-z\\s&.,@!#%*()\\-+=\\[\\]:;\\"\'<>\\?/\\\\|^~`]+$'} 
        title="Only alphabets and spaces are allowed."
        required
      />

      {/* Institute */}
      <label className="block font-semibold text-[#777585] mb-2">
        Institute <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="institute"
        value={formData.institute}
        onChange={handleChange}
        placeholder="Enter Institute"
        className="border p-2 w-full mb-4 rounded"
        required
      />
      <label className="block font-semibold text-[#777585] mb-2">Marks</label>
      <input
        type="number"
        name="marks"
        value={formData.marks}
        onChange={handleChange}
        placeholder="Enter CGPA (e.g. 8.2)"
        className="border p-2 w-full mb-4 rounded"
        step="0.01"
        min="0"
        max="100"
      />

      {/* Starting & Passing Year */}
      <label className="block font-semibold text-[#777585] mb-2">
        Starting Year <span className="text-red-500">*</span>
      </label>
      <select
        name="startYear"
        value={formData.startYear}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      >
        <option value="">Year</option>
        {Array.from({ length: 20 }, (_, i) => (
          <option key={i} value={2024 - i}>
            {2024 - i}
          </option>
        ))}
      </select>

      <label className="block font-semibold text-[#777585] mb-2">
        Passing Year <span className="text-red-500">*</span>
      </label>
      <select
        name="passingYear"
        value={formData.passingYear}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      >
        <option value="">Year</option>
        {Array.from({ length: 20 }, (_, i) => (
          <option key={i} value={2024 - i}>
            {2024 - i}
          </option>
        ))}
      </select>

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
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="text-purple-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};
EducationalDetailsForm.metadata = {
  componentName: "EducationalDetailsForm",
  description:
    "A component that allows users to input and submit their educational details, including qualification, specialization, institute, marks, start year, passing year, and an optional description.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to submit educational details
    inputValidation: true, // Validates required fields before submission
    toastNotifications: true, // Provides feedback on submission success or error
    clearFields: true, // Allows users to clear the form fields
  },
  data: {
    initialContent: {
      qualification: "", // Initial value for qualification input
      specialization: "", // Initial value for specialization input
      institute: "", // Initial value for institute input
      marks: "", // Initial value for marks input
      startYear: "", // Initial value for start year selection
      passingYear: "", // Initial value for passing year selection
      description: "", // Initial value for description textarea
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    requiredFields: "Indicates which fields are required for submission.",
    clearButton: "Allows users to clear form fields easily.",
  },
  styles: {
    container: {
      padding: "2rem", // Padding for the main form container
      backgroundColor: "white", // Background color for the component
      borderRadius: "8px", // Rounded corners for the form
    },
    title: {
      fontSize: "1.5rem", // Font size for the form title
      fontWeight: "600", // Font weight for the form title
    },
    input: {
      border: "1px solid #ccc", // Border style for input fields
      padding: "0.5rem", // Padding for input fields
      borderRadius: "4px", // Rounded corners for input fields
    },
    buttons: {
      submit: {
        backgroundColor: "#4CAF50", // Background color for the submit button
        color: "white", // Text color for the submit button
      },
      cancel: {
        backgroundColor: "#f44336", // Background color for the cancel button
        color: "white", // Text color for the cancel button
      },
    },
  },
  apiEndpoints: {
    addEducation: {
      method: "POST",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addEducation(":userId")}`, // Endpoint for adding education details
      description: "Adds the educational details to the user's profile.",
      requestBody: {
        institution: "string", // Institution name
        degree: "string", // Degree name
        specialization: "string", // Specialization name
        startYear: "Date", // Start year of education
        endYear: "Date | Present", // End year of education or 'Present'
        Marks: "number", // Marks obtained
        description: "string", // Optional description of the education
      },
      successResponse: {
        status: 200,
        message: "Education details added successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while adding education details.",
      },
    },
  },
};
export default EducationalDetailsForm;
