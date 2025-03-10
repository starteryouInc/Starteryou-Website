import React, { useState } from "react";
import { API_CONFIG } from "../../../../config/api";
import { useUserContext } from "../../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";

const EditProject = ({ closeEditProject, project, getProfileFieldData }) => {
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

  const EndDate = formatDate(project.endYear);

  const [formData, setFormData] = useState({
    projectTitle: project.title,
    projectURL: project.projectURL,
    description: project.description,
    endYear: EndDate.year,
    endMonth: EndDate.month,
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    if (!formData.projectTitle) {
      return toast.error("Please fill out all the required fields");
    }

    if (formData.projectURL && !validateURL(formData.projectURL)) {
      return toast.error("Please enter a valid Project URL.");
    }

    const endDate =
      formData.endYear && formData.endMonth
        ? new Date(`${formData.endYear}-${formData.endMonth}-01`)
        : null;

    // Validation: Prevent links in the description
    const linkRegex = /https?:\/\/|www\.|ftp:\/\//i;
    if (linkRegex.test(formData.description)) {
      return toast.error("Links are not allowed in the description.");
    }

    const projects = {
      title: formData.projectTitle,
      description: formData.description,
      endYear: endDate,
      projectURL: formData.projectURL,
    };

    try {
      const userId = user?.authenticatedUser?._id;
      const { data } = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateProject(
          userId,
          project._id
        )}`,
        projects,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
      closeEditProject();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]"
    >
      <h3 className="text-2xl font-semibold mb-4">Projects</h3>

      <label className="block font-semibold text-[#777585] mb-2">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="projectTitle"
        placeholder="Enter your title"
        value={formData.projectTitle}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />

      <label className="block font-semibold text-[#777585] mb-2">URL</label>
      <input
        type="text"
        name="projectURL"
        placeholder="Enter your URL"
        value={formData.projectURL}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">
        End Date
      </label>
      <div className="flex gap-4 mb-4">
        <select
          name="endYear"
          value={formData.endYear}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
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
        <select
          name="endMonth"
          value={formData.endMonth}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
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

      <label className="block font-semibold text-[#777585] mb-2">
        Details of Projects
      </label>
      <textarea
        name="description"
        placeholder="Enter your project detail"
        value={formData.description}
        onChange={handleChange}
        maxLength={1000}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      ></textarea>
      <p className="block font-medium mb-2">Max. 1000/1000 Characters</p>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button onClick={closeEditProject} className="text-purple-600">
          Cancel
        </button>
      </div>
    </form>
  );
};
EditProject.metadata = {
  componentName: "EditProject",
  description:
    "A form component for editing project details, including title, URL, description, and end date.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to edit project details
    inputValidation: true, // Validates required fields before submission
    toastNotifications: true, // Provides feedback on submission success or failure
    clearForm: false, // Does not clear the form after submission, retains state for editing
  },
  data: {
    initialContent: {
      projectTitle: "", // Title of the project
      projectURL: "", // URL link to the project
      description: "", // Description of the project
      endYear: "", // Year the project ended
      endMonth: "", // Month the project ended
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    requiredFields: "Indicates required fields with asterisks.",
    clearButton: "No explicit clear button; uses form submission to update.",
  },
  styles: {
    container: {
      maxWidth: "3xl", // Maximum width of the form
      margin: "1rem auto", // Center the form with margin
      backgroundColor: "white", // Background color for the form
      padding: "2rem", // Padding for the form
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
    updateProject: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateProject(":userId", ":projectId")}`, // Endpoint for updating project details
      description: "Updates an existing project entry for the authenticated user.",
      requestBody: {
        userId: "string", // The ID of the user
        projectId: "string", // The ID of the project entry to be updated
        title: "string", // Title of the project
        description: "string", // Description of the project
        endYear: "Date|null", // End year of the project (can be null if ongoing)
        projectURL: "string", // URL link to the project
      },
      successResponse: {
        status: 200,
        message: "Project updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while updating the project.",
      },
    },
  },
};
export default EditProject;
