import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { IoLanguageSharp } from "react-icons/io5";

const LanguagesCard = () => {
    const ProjectList = [
        {
          langID: 1,
          language: "English",
          proficiency: "Native",
        },
        {
            langID: 2,
            language: "Spanish",
            proficiency: "Readable",
          },
      ];
  return (
    <div
    className={`language-display-card ${
      ProjectList.length !== 0 ? "space-y-4" : "space-y-0"
    } `}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-2xl">Languages</h2>
      <h4 className="text-[#6a54df] font-semibold">+ Add</h4>
    </div>
    <section className="flex flex-col items-start justify-between space-y-4">
      {ProjectList.length !== 0
        ? ProjectList.map((e) => (
            <div key={e.langID} className="flex items-start w-full">
              {/* Icon */}
              <IoLanguageSharp className="icon-style mr-4"/>

              {/* Details */}
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">{e.language}</h1>
                <h2 className="text-lg text-[#777585]">{e.proficiency}</h2>
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
  )
}

export default LanguagesCard