import React, { useState } from "react";
import { API_CONFIG } from "../../../../config/api";
import { useUserContext } from "../../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";

const EditCourse = ({ closeEditCourse, course, getProfileFieldData }) => {
  const { user } = useUserContext();

  const token = user?.token;

  // Function to formate the dates coming from the db according to their respective fields
  const formatDate = (dateString) => {
    if (!dateString) return { year: "", month: "" };
    const date = new Date(dateString);
    const monthNames = [
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
    ];
    return {
      year: date.getFullYear().toString(),
      month: monthNames[date.getMonth()], // Convert numeric month to full name
    };
  };

  const ExpiryDate = formatDate(course.expiryDate);

  const [formData, setFormData] = useState({
    certificateTitle: course.title,
    issuedBy: course.issuedBy,
    certificateURL: course.certificateURL,
    doesNotExpire: course.expiryDate ? false : true,
    year: ExpiryDate.year,
    month: ExpiryDate.month,
  });

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
      const { data } = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateCertificate(
          userId,
          course._id
        )}`,
        certifications,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
      closeEditCourse();
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
        <button onClick={closeEditCourse} className="text-purple-600">
          Cancel
        </button>
      </div>
    </form>
  );
};
EditCourse.metadata = {
  componentName: "EditCourse",
  description:
    "A form component for editing course and certification details, including certificate title, issuer, URL, and expiry information.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to edit course
    inputValidation: true, // Validates required fields before submission
    toastNotifications: true, // Provides feedback on submission success or failure
    clearForm: false, // Does not clear the form after submission, retains state for editing
  },
  data: {
    initialContent: {
      certificateTitle: "", // Title of the certificate
      issuedBy: "", // Issuer of the certificate
      certificateURL: "", // URL for the certificate
      doesNotExpire: false, // Indicates if the certificate does not expire
      year: "", // Year of expiry
      month: "", // Month of expiry
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    requiredFields: "Indicates required fields with asterisks.",
    clearButton: "No explicit clear button; uses form submission to update.",
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
  },
  apiEndpoints: {
    updateCertificate: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateCertificate(":userId", ":courseId")}`, // Endpoint for updating a certificate
      description: "Updates an existing certification entry for the authenticated user.",
      requestBody: {
        userId: "string", // The ID of the user
        courseId: "string", // The ID of the course to be updated
        title: "string", // Title of the certificate
        issuedBy: "string", // Issuer of the certificate
        expiryDate: "Date|null", // Expiry date of the certificate (null if it does not expire)
        certificateURL: "string", // URL for the certificate
      },
      successResponse: {
        status: 200,
        message: "Certification updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while updating the certification.",
      },
    },
  },
};
export default EditCourse;
