import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import ProjectIcon from "/UserProfile/ProjectIcon.svg";

const ProjectCard = () => {
  const ProjectList = [
    {
      projectID: 1,
      projectName: "Youtube Clone",
      projectURL: "https://www.google.com",
      finishedDate: "Aug 2024",
      // projectDetail: " ",
    },
    {
      projectID: 2,
      projectName: "Youtube Clone",
      projectURL: "https://www.google.com",
      finishedDate: "Aug 2024",
      //   projectDetail: " ",
    },
  ];
  return (
    <div
      className={`project-display-card ${
        ProjectList.length !== 0 ? "space-y-4" : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Projects</h2>
        <h4 className="text-[#6a54df] font-semibold">+ Add</h4>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {ProjectList.length !== 0
          ? ProjectList.map((e) => (
              <div key={e.projectID} className="flex items-start w-full">
                {/* Icon */}
                <img src={ProjectIcon} alt="" className="mr-4" />

                {/* Details */}
                <div className="space-y-2">
                  <h1 className="text-xl">{e.projectName}</h1>
                  <h2 className="text-lg font-semibold">{e.projectURL}</h2>
                  <h5 className="text-lg text-[#777585]">{e.finishedDate}</h5>
                  {e.projectDetail ? (
                    <p className="text-lg">{e.projectDetail}</p>
                  ) : (
                    " "
                  )}
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

export default ProjectCard;
