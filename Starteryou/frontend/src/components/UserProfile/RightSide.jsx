import React, { useState } from "react";
import "./styles/RightSide.css"
import WorkCard from "./RightSideComponents/WorkCard";
import EducationCard from "./RightSideComponents/EducationCard";
import CoursCertiCard from "./RightSideComponents/CoursCertiCard";
import ProjectCard from "./RightSideComponents/ProjectCard";
import LanguagesCard from "./RightSideComponents/LanguagesCard";
import SkillsCard from "./RightSideComponents/SkillsCard";
import WorkExperienceForm from "./RightSideComponents/WorkExperienceForm";
import EducationalDetailsForm from "./RightSideComponents/EducationDetailForm";

const RightSide = () => {
  const [openWorkForm, setOpenWorkForm] = useState(false);
  const [openEducationForm, setOpenEducationForm] = useState(false);
  return (
    <div className="right">
      <WorkCard openWorkForm={() => setOpenWorkForm(true)} />
      <EducationCard openEducationForm={() => setOpenEducationForm(true)}/>
      <SkillsCard />
      <CoursCertiCard />
      <ProjectCard />
      <LanguagesCard />

      {openWorkForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
         justify-center z-50 overflow-y-scroll">
          <WorkExperienceForm openWorkForm={() => setOpenWorkForm(false)} />
        </div>
      )}
      {openEducationForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll">
          <EducationalDetailsForm openEducationForm={() => setOpenEducationForm(false)} />
        </div>
      )}
    </div>
  );
};

export default RightSide;
