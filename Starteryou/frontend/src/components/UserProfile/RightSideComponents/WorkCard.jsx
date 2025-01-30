import React, { useEffect } from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { PiBagSimpleFill } from "react-icons/pi";
import { MdOutlineDelete } from "react-icons/md";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

const WorkCard = ({ openWorkForm, data }) => {
  // const Experience = [
  //   {
  //     experienceID: 1,
  //     position: "UX Designer",
  //     company: "Starter You",
  //     duration: "Aug 2024 to present",
  //     noticePeriod: "Immediately available",
  //   },
  //   {
  //     experienceID: 2,
  //     position: "Content Writer",
  //     company: "Starter You",
  //     duration: "Aug 2024 to present",
  //     noticePeriod: "Immediately available",
  //   },
  // ];

  // console.log("work", data)

  const { user } = useUserContext();

  const token = user?.token;

  function formatDateRange(startDate, endDate = null) {
    const options = { year: "numeric", month: "long" };

    const start = new Date(startDate).toLocaleDateString("en-US", options);
    const end = endDate
      ? new Date(endDate).toLocaleDateString("en-US", options)
      : "Present";

    return `${start} to ${end}`;
  }

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
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <div
      className={`work-display-card ${
        data.length !== 0 ? "space-y-4" : "space-y-0"
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
    </div>
  );
};

export default WorkCard;
