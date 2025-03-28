/**
 * ProjectCard Component
 * Displays a list of projects with options to edit or delete.
 *
 * @param {Object} props - Component props
 * @param {Function} props.openProjectForm - Function to open the project form
 * @param {Array} props.data - List of projects
 * @param {Function} props.getProfileFieldData - Function to refresh profile data
 * @returns {JSX.Element} React component
 */
import React, { useState } from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import ProjectIcon from "/UserProfile/ProjectIcon.svg";
import { MdOutlineDelete } from "react-icons/md";
import { useUserContext } from "../../../context/UserContext";
import axios from "axios";
import { API_CONFIG } from "../../../config/api";
import { toast } from 'react-hot-toast';
import EditProject from "./EditableForms/EditProject";

const ProjectCard = ({ openProjectForm, data, getProfileFieldData }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEditProject, setOpenEditProject] = useState(false);
  const { user } = useUserContext();
  const token = user?.token;
  /**
   * Formats the project end date.
   *
   * @param {string} expiryDate - Project expiry date in string format
   * @returns {string} Formatted date (e.g., "January 2024")
   */
  function formatProjectEndDate(expiryDate) {
    const options = { year: "numeric", month: "long" };
    const formattedDate = new Date(expiryDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  /**
   * Handles project deletion.
   *
   * @param {string} subDocId - ID of the project to be deleted
   * @returns {Promise<void>}
   */
  const handleDeleteData = async (subDocId) => {
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteProject(
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
      className={`project-display-card ${
        openEditProject
          ? "space-y-0"
          : data.length !== 0
          ? "space-y-4"
          : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <button
          onClick={openProjectForm}
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
                  <img src={ProjectIcon} alt="" className="mr-4" />

                  {/* Details */}
                  <div className="space-y-2">
                    <h1 className="text-xl">{e.title}</h1>
                    <h2 className="text-lg font-semibold">
                      <a
                        href={e.projectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8176FF] font-semibold inline-block"
                      >
                        View Project
                      </a>
                    </h2>
                    {e.endYear && (
                      <h5 className="text-lg text-[#777585]">
                        {formatProjectEndDate(e.endYear)}
                      </h5>
                    )}
                    {e.description ? (
                      <p className="text-lg">{e.description}</p>
                    ) : (
                      <h2 className="text-xl text-[#6a54df] font-semibold cursor-pointer">
                        Add Details
                      </h2>
                    )}
                  </div>
                </div>

                {/* Edit Icon */}
                <div className="icons flex items-center space-x-2">
                  <img
                    src={EditPen}
                    onClick={() => {
                      setSelectedProject(e);
                      setOpenEditProject(true);
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
      {openEditProject && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EditProject
            getProfileFieldData={getProfileFieldData}
            project={selectedProject}
            closeEditProject={() => setOpenEditProject(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
