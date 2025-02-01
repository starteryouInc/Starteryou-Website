import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import ProjectIcon from "/UserProfile/ProjectIcon.svg";
import { MdOutlineDelete } from "react-icons/md";
import { useUserContext } from "../../../context/UserContext";
import axios from "axios";
import { API_CONFIG } from "../../../config/api";
import { toast } from "react-toastify";

const ProjectCard = ({ openProjectForm, data, getProfileFieldData }) => {
  const { user } = useUserContext();
  const token = user?.token;

  function formatProjectEndDate(expiryDate) {
    const options = { year: "numeric", month: "long" };
    const formattedDate = new Date(expiryDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

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
        data.length !== 0 ? "space-y-4" : "space-y-0"
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
                    <h2 className="text-lg font-semibold">{e.projectURL}</h2>
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
    </div>
  );
};

export default ProjectCard;
