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

export default ApplyJobCard;
