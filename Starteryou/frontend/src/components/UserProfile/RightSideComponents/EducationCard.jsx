import React, { useState } from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import EduHat from "/UserProfile/EduHat.svg";
import { MdOutlineDelete } from "react-icons/md";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from 'react-hot-toast';
import axios from "axios";
import EditEducation from "./EditableForms/EditEducation";
/**
 * Component for displaying and managing an education card.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.openEducationForm - Function to toggle the education form.
 * @param {Object[]} props.data - Array of education records.
 * @param {Function} props.getProfileFieldData - Function to refresh the profile field data.
 * @returns {JSX.Element} The EducationCard component.
 */
const EducationCard = ({ openEducationForm, data, getProfileFieldData }) => {
  const [selectedEdu, setSelectedEdu] = useState(null);
  const [openEditEdu, setOpenEditEdu] = useState(false);
  const { user } = useUserContext();
  const token = user?.token;
  /**
   * Formats a date range into a readable string.
   *
   * @param {string} startDate - The start date in ISO format.
   * @param {string|null} [endDate=null] - The optional end date in ISO format.
   * @returns {string} The formatted date range as 'Month Year to Month Year' or 'Month Year to Present'.
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
   * Deletes an education record via API and updates the profile data.
   *
   * @param {string} subDocId - The ID of the education record to delete.
   * @returns {Promise<void>} A promise that resolves when the education record is deleted.
   */
  const handleDeleteData = async (subDocId) => {
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteEducation(
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
      className={`educational-display-card ${
        openEditEdu
          ? "space-y-0"
          : data.length !== 0
          ? "space-y-4"
          : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Educational Details</h2>
        <button
          onClick={openEducationForm}
          className="text-[#6a54df] font-semibold"
        >
          + Add
        </button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {data.length !== 0
          ? data.map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-start w-full"
              >
                <div className="flex items-start">
                  {/* Icon */}
                  <img src={EduHat} alt="Education Hat icon" className="mr-4" />

                  {/* Details */}
                  <div className="space-y-1">
                    <h1 className="text-xl">
                      {e.degree}{" "}
                      {e.specialization ? "in " + e.specialization : " "}
                    </h1>
                    <h2 className="text-lg font-semibold">{e.institution}</h2>
                    <h5 className="text-lg text-[#777585]">
                      {formatDateRange(e.startYear, e.endYear)}
                    </h5>
                    <h5 className="text-lg text-[#777585]">CGPA: {e.Marks}</h5>
                    {e.description ? (
                      <p className="text-lg">{e.description}</p>
                    ) : (
                      <h2 className="text-xl text-[#6a54df] font-semibold cursor-pointer">
                        Add Description
                      </h2>
                    )}
                  </div>
                </div>

                {/* Edit Icon */}
                <div className="icons flex items-center space-x-2">
                  <img
                    src={EditPen}
                    onClick={() => {
                      setSelectedEdu(e);
                      setOpenEditEdu(true);
                    }}
                    alt="Edit Education details"
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
      {openEditEdu && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EditEducation
            getProfileFieldData={getProfileFieldData}
            education={selectedEdu}
            closeEditEdu={() => setOpenEditEdu(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EducationCard;
