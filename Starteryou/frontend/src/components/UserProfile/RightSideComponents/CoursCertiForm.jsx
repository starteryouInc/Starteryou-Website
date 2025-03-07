import React, { useState } from "react";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from 'react-hot-toast';;
import axios from "axios";

const CoursCertiForm = ({ openCertificationForm, getProfileFieldData }) => {
  const { user } = useUserContext();

  const token = user?.token;

  const [formData, setFormData] = useState({
    certificateTitle: "",
    issuedBy: "",
    certificateURL: "",
    doesNotExpire: false,
    year: "",
    month: "",
  });

  // Function to clear all fields
  const clearAllFields = () => {
    setFormData({
      certificateTitle: "",
      issuedBy: "",
      certificateURL: "",
      doesNotExpire: false,
      year: "",
      month: "",
    });
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Correct handling for checkboxes
    });
  };

  //Function to validate the URL's
  const validateURL = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})([/\w .-]*)*\/?$/i;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.certificateTitle || !formData.issuedBy) {
      return toast.error("Please fill out all the required fields.");
    }

    if (formData.certificateURL && !validateURL(formData.certificateURL)) {
      return toast.error("Please enter a valid certificate URL.");
    }

    const expiryDate =
      !formData.doesNotExpire && formData.year && formData.month
        ? new Date(`${formData.year}-${formData.month}-01`)
        : null;

    const certifications = {
      title: formData.certificateTitle,
      issuedBy: formData.issuedBy,
      expiryDate: expiryDate,
      certificateURL: formData.certificateURL,
    };

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.addCertificate(userId)}`,
        certifications,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
      clearAllFields();
      openCertificationForm();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]"
    >
      <h3 className="text-2xl font-semibold mb-4">Courses and Certification</h3>

      <label className="block font-semibold text-[#777585] mb-2">
        Certification <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="certificateTitle"
        placeholder="Enter your certificate"
        value={formData.certificateTitle}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">
        Issued By <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="issuedBy"
        placeholder="Enter your certificate issuer"
        value={formData.issuedBy}
        onChange={handleChange}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <label className="block font-semibold text-[#777585] mb-2">
        Certificate URL
      </label>
      <input
        type="text"
        name="certificateURL"
        placeholder="Enter your certificate link or url"
        value={formData.certificateURL}
        onChange={handleChange}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="doesNotExpire"
          checked={formData.doesNotExpire}
          onChange={handleChange}
          className="w-4 h-4 mr-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label className="block font-semibold">
          This credential does not expire
        </label>
      </div>

      {!formData.doesNotExpire && (
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block font-semibold text-[#777585] mb-2">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Year</option>
              {Array.from(
                { length: 50 },
                (_, i) => new Date().getFullYear() - i
              ).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#777585] mb-2">
              Month
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              ].map((m, index) => (
                <option key={index} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button onClick={openCertificationForm} className="text-purple-600">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CoursCertiForm;
