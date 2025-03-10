/**
 * React component for applying to a job.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.jobID - The ID of the job to apply for
 * @param {Function} props.closeApplyJob - Function to close the job application form
 * @returns {JSX.Element} The job application form
 */
import React, { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { API_CONFIG } from "../../config/api";
import { toast } from 'react-hot-toast';
import axios from "axios";

const ApplyJobCard = ({ jobID, closeApplyJob }) => {
  const { user } = useUserContext();
  const token = user?.token;
  const email = user?.authenticatedUser?.email || "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email,
    whyHire: "",
  });
  /**
   * Clears all input fields in the form.
   */
  const clearAllFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email,
      whyHire: "",
    });
  };

  /**
   * Handles input change events.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles the form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobID) {
      toast.error("Job id is missing!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.applyJob(jobID)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      closeApplyJob();
      clearAllFields();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 mx-4 border rounded-lg w-full max-w-md"
    >
      <div className="mb-4">
        <label className="block font-semibold text-[#777585]">
          First name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          pattern="[A-Za-z\s]+"
          title="Only alphabets and spaces are allowed."
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold text-[#777585]">
          Last name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          pattern="[A-Za-z\s]+"
          title="Only alphabets and spaces are allowed."
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold text-[#777585]">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="mt-1 block w-full px-3 py-2 bg-blue-100 cursor-not-allowed border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold text-[#777585]">
          Why should we hire you?
        </label>
        <textarea
          name="whyHire"
          value={formData.whyHire}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="privacyPolicy"
            required
            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="ml-2 font-medium text-[#777585]">
            You agree to our friendly privacy policy.
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full mb-3 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Apply now!
      </button>
      <button
        onClick={closeApplyJob}
        className="w-full bg-white text-purple-600 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Cancel
      </button>
    </form>
  );
};

ApplyJobCard.metadata = {
  componentName: "ApplyJobCard",
  description:
    "A component that provides a job application form for users to apply for a specific job, including input fields for personal information and a submission handler.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to apply
    inputValidation: true, // Validates input fields for required information
    toastNotifications: true, // Provides feedback on submission success or error
    privacyPolicyAgreement: true, // Requires agreement to privacy policy before submission
  },
  data: {
    initialFormData: {
      firstName: "",
      lastName: "",
      email: "", // Email is fetched from user context and disabled
      whyHire: "",
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    requiredFields: "Indicates required fields with asterisks for clarity.",
    disabledInput: "Email field is disabled to prevent user modification.",
  },
  styles: {
    formContainer: {
      backgroundColor: "white", // Background color for the form
      padding: "2rem", // Padding for the form container
      border: "1px solid #E5E7EB", // Border style for the form
      borderRadius: "0.5rem", // Rounded corners for the form
      width: "100%", // Full width for the form
      maxWidth: "400px", // Max width for the form
      margin: "0 auto", // Center alignment for the form
    },
    inputField: {
      border: "1px solid #D1D5DB", // Border color for input fields
      padding: "0.5rem", // Padding for input fields
      borderRadius: "0.375rem", // Rounded corners for input fields
      width: "100%", // Full width for input fields
    },
    button: {
      submit: {
        backgroundColor: "#6B46C1", // Background color for the submit button
        color: "white", // Text color for the submit button
        padding: "0.5rem 1rem", // Padding for the submit button
        borderRadius: "0.375rem", // Rounded corners for the submit button
      },
      cancel: {
        backgroundColor: "white", // Background color for the cancel button
        color: "#6B46C1", // Text color for the cancel button
        padding: "0.5rem 1rem", // Padding for the cancel button
        borderRadius: "0.375rem", // Rounded corners for the cancel button
      },
    },
  },
  apiEndpoints: {
    applyJob: {
      method: "POST",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.applyJob(":jobID")}`, // Endpoint for applying to a job
      description: "Submits the job application for the specified job ID.",
      headers: {
        Authorization: "Bearer <token>", // Bearer token for user authentication
      },
      requestBody: {
        firstName: "string", // User's first name
        lastName: "string", // User's last name
        email: "string", // User's email
        whyHire: "string", // Reason for hiring
      },
      successResponse: {
        status: 200,
        message: "Application submitted successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error message describing what went wrong.",
      },
    },
  },
};
export default ApplyJobCard;
