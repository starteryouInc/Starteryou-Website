import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import EduHat from "/UserProfile/EduHat.svg";

const EducationCard = ({ openEducationForm }) => {
  const EducationalDetails = [
    {
      educationID: 1,
      qualification: "B.Tech",
      specialisation: "Computer Science",
      institute: "Bits Pilani",
      duration: "Aug 2022 to July 2025",
      marks: 8.2,
    },
    {
        educationID: 2,
        qualification: "B.Tech",
        specialisation: "Computer Science",
        institute: "Bits Pilani",
        duration: "Aug 2022 to July 2025",
        marks: 8.2,
      },
  ];
  return (
    <div
      className={`educational-display-card ${
        EducationalDetails.length !== 0 ? "space-y-4" : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Educational Details</h2>
        <button onClick={openEducationForm} className="text-[#6a54df] font-semibold">+ Add</button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {EducationalDetails.length !== 0
          ? EducationalDetails.map((e) => (
              <div key={e.educationID} className="flex items-start w-full">
                {/* Icon */}
                <img src={EduHat} alt="Education Hat icon" className="mr-4" />

                {/* Details */}
                <div className="space-y-1">
                  <h1 className="text-xl">
                    {e.qualification}{" "}
                    {e.specialisation ? "in " + e.specialisation : " "}
                  </h1>
                  <h2 className="text-lg font-semibold">{e.institute}</h2>
                  <h5 className="text-lg text-[#777585]">{e.duration}</h5>
                  <h5 className="text-lg text-[#777585]">CGPA: {e.marks}</h5>
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

export default EducationCard;
