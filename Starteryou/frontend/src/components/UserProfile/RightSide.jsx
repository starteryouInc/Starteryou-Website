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
import SkillsInputForm from "./RightSideComponents/SkillsInputForm";
import CoursCertiForm from "./RightSideComponents/CoursCertiForm";
import ProjectForm from "./RightSideComponents/ProjectForm";
import LanguageForm from "./RightSideComponents/LanguageForm";

const RightSide = () => {
  const [openWorkForm, setOpenWorkForm] = useState(false);
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [openCertificationForm, setOpenCertificationForm] = useState(false);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [openLanguageForm, setOpenLanguageForm] = useState(false);
  return (
    <div className="right">
      <WorkCard openWorkForm={() => setOpenWorkForm(true)} />
      <EducationCard openEducationForm={() => setOpenEducationForm(true)}/>
      <SkillsCard openSkillForm={() => setOpenSkillForm(true)}/>
      <CoursCertiCard openCertificationForm={() => setOpenCertificationForm(true)}/>
      <ProjectCard openProjectForm={() => setOpenProjectForm(true)}/>
      <LanguagesCard openLanguageForm={() => setOpenLanguageForm(true)}/>

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
      {openSkillForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll">
          <SkillsInputForm openSkillForm={() => setOpenSkillForm(false)} />
        </div>
      )}
      {openCertificationForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll">
          <CoursCertiForm openCertificationForm={() => setOpenCertificationForm(false)} />
        </div>
      )}
      {openProjectForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll">
          <ProjectForm openProjectForm={() => setOpenProjectForm(false)} />
        </div>
      )}
      {openLanguageForm && (
        <div className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll">
          <LanguageForm openLanguageForm={() => setOpenLanguageForm(false)} />
        </div>
      )}
    </div>
  );
};

export default RightSide;
