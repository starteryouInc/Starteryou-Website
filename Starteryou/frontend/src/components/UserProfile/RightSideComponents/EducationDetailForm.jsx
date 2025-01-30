import React, { useState } from "react";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

const EducationalDetailsForm = ({ openEducationForm }) => {
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

export default EducationalDetailsForm;
