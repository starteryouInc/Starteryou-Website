import React, { useState } from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { PiBagSimpleFill } from "react-icons/pi";
import { MdOutlineDelete } from "react-icons/md";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";
import EditWork from "./EditableForms/EditWork";
/**
 * Component for displaying a work experience card.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.openWorkForm - Function to open the work experience form.
 * @param {Object[]} props.data - Array of work experience objects.
 * @param {Function} props.getProfileFieldData - Function to refresh profile field data.
 * @returns {JSX.Element} The WorkCard component.
 */
const WorkCard = ({ openWorkForm, data, getProfileFieldData }) => {
  const [selectedExp, setSelectedExp] = useState(null);
  const [openEditWork, setOpenEditWork] = useState(false);
  const { user } = useUserContext();
  const token = user?.token;
  /**
   * Formats a date range into a readable string.
   *
   * @param {string} startDate - The start date in ISO format.
   * @param {string|null} [endDate=null] - The end date in ISO format, or null for 'Present'.
   * @returns {string} The formatted date range.
   */
  function formatDateRange(startDate, endDate = null) {
    const options = { year: "numeric", month: "long" };

    const start = new Date(startDate).toLocaleDateString("en-US", options);
    const end = endDate
      ? new Date(endDate).toLocaleDateString("en-US", options)
      : "Present";

    return `${start} to ${end}`;
  }
  /**
   * Handles deletion of a work experience entry.
   *
   * @param {string} subDocId - The ID of the work experience entry to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  const handleDeleteData = async (subDocId) => {
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteWorkExperience(
          userId,
          subDocId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <div
      className={`work-display-card ${
        openEditWork
          ? "space-y-0"
          : data.length !== 0
          ? "space-y-4"
          : "space-y-0"
      } `}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Work Experience</h2>
        <button onClick={openWorkForm} className="text-[#6a54df] font-semibold">
          + Add
        </button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {data.length !== 0
          ? data.map((e) => (
              <div key={e._id} className="flex items-start w-full">
                {/* Icon */}
                <PiBagSimpleFill className="icon-style mr-4" />

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <h1 className="text-xl">{e.jobTitle}</h1>
                  <h2 className="text-lg font-semibold">{e.companyName}</h2>
                  <h5 className="text-lg text-[#777585]">
                    {formatDateRange(e.startDate, e.endDate)}
                  </h5>
                  {/* <h5 className="text-lg text-[#777585]">Notice Period: {e.noticePeriod}</h5> */}
                  {e.description ? (
                    <p className="text-lg">{e.description}</p>
                  ) : (
                    <h2 className="text-xl text-[#6a54df] font-semibold cursor-pointer">
                      Add Description
                    </h2>
                  )}
                </div>

                {/* Edit Icon */}
                <div className="icons flex items-center space-x-2">
                  <img
                    src={EditPen}
                    onClick={() => {
                      setSelectedExp(e);
                      setOpenEditWork(true);
                    }}
                    alt="Edit Experience"
                    className="cursor-pointer ml-auto"
                  />
                  <MdOutlineDelete
                    className="text-[#6a54df] cursor-pointer"
                    style={{ width: "22px", height: "22px" }}
                    onClick={() => handleDeleteData(e._id)}
                  />
                </div>
              </div>
            ))
          : ""}
      </section>
      {openEditWork && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EditWork
            getProfileFieldData={getProfileFieldData}
            job={selectedExp}
            closeEditWork={() => setOpenEditWork(false)}
          />
        </div>
      )}
    </div>
  );
};
WorkCard.metadata = {
  componentName: "WorkCard",
  description:
    "A component for displaying and managing work experience entries, including the ability to add, edit, and delete experiences.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to manage work experience
    inputValidation: false, // Input validation handled in EditWork component
    toastNotifications: true, // Provides feedback on actions like add, edit, and delete
    editable: true, // Allows users to edit their work experience
  },
  data: {
    initialContent: {
      workExperience: [], // Initial array of work experience objects
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    editable: "Allows users to easily manage their work experience.",
    deleteConfirmation: "Prompts user for confirmation before deletion.",
  },
  styles: {
    container: {
      padding: "2rem", // Padding for the main container
      backgroundColor: "white", // Background color for the component
    },
    title: {
      fontSize: "2rem", // Font size for the title
      fontWeight: "bold", // Font weight for the title
    },
    experienceItem: {
      display: "flex", // Flexbox for work experience items
      alignItems: "flex-start", // Align items to the top
      marginBottom: "1rem", // Space between items
    },
    icons: {
      display: "flex", // Flexbox for icons
      alignItems: "center", // Center icons vertically
    },
  },
  apiEndpoints: {
    deleteExperience: {
      method: "DELETE",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteWorkExperience(":userId", ":subDocId")}`, // Endpoint for deleting work experience
      description: "Deletes a work experience entry based on user ID and entry ID.",
      requestBody: {
        userId: "string", // The ID of the user
        subDocId: "string", // The ID of the work experience entry to delete
      },
      successResponse: {
        status: 200,
        message: "Work experience deleted successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while deleting work experience.",
      },
    },
  },
};
export default WorkCard;
