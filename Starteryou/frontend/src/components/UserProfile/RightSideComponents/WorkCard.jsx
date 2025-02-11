import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { PiBagSimpleFill } from "react-icons/pi";

const WorkCard = ({ openWorkForm }) => {
  const Experience = [
    {
      experienceID: 1,
      position: "UX Designer",
      company: "Starter You",
      duration: "Aug 2024 to present",
      noticePeriod: "Immediately available",
    },
    {
      experienceID: 2,
      position: "Content Writer",
      company: "Starter You",
      duration: "Aug 2024 to present",
      noticePeriod: "Immediately available",
    },
  ];

  return (
    <div
      className={`work-display-card ${
        Experience.length !== 0 ? "space-y-4" : "space-y-0"
      } `}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Work Experience</h2>
        <button onClick={openWorkForm} className="text-[#6a54df] font-semibold">+ Add</button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {Experience.length !== 0
          ? Experience.map((e) => (
              <div key={e.experienceID} className="flex items-start w-full">
                {/* Icon */}
                <PiBagSimpleFill className="icon-style mr-4" />

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <h1 className="text-xl">{e.position}</h1>
                  <h2 className="text-lg font-semibold">{e.company}</h2>
                  <h5 className="text-lg text-[#777585]">{e.duration}</h5>
                  <h5 className="text-lg text-[#777585]">Notice Period: {e.noticePeriod}</h5>
                  <h2 className="text-xl text-[#6a54df] font-semibold cursor-pointer">
                    Add Description
                  </h2>
                </div>

                {/* Edit Icon */}
                <img
                  src={EditPen}
                  alt="Edit Experience"
                  className="cursor-pointer ml-auto"
                />
              </div>
            ))
          : ""}
      </section>
    </div>
  );
};

export default WorkCard;
