import React, { useState } from "react";
import "./styles/RightSide.css";
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
import ApplyJobCard from "../JobFeedPage/ApplyJobCard";
import CreateJobCard from "../JobFeedPage/CreateJobCard";

const RightSide = ({ UserProfile, getProfileFunction }) => {
  const [openWorkForm, setOpenWorkForm] = useState(false);
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [openCertificationForm, setOpenCertificationForm] = useState(false);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [openLanguageForm, setOpenLanguageForm] = useState(false);

  const {
    workExperience = [],
    educationDetails = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
  } = UserProfile || {};

  return (
    <div className="right">
      <WorkCard data={workExperience} openWorkForm={() => setOpenWorkForm(true)} />
      <EducationCard data={educationDetails} openEducationForm={() => setOpenEducationForm(true)} />
      <SkillsCard data={skills} openSkillForm={() => setOpenSkillForm(true)} />
      <CoursCertiCard data={certifications}
        openCertificationForm={() => setOpenCertificationForm(true)}
      />
      <ProjectCard data={projects} openProjectForm={() => setOpenProjectForm(true)} />
      <LanguagesCard data={languages} openLanguageForm={() => setOpenLanguageForm(true)} />

      {openWorkForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
         justify-center z-50 overflow-y-scroll"
        >
          <WorkExperienceForm getProfileFunction={getProfileFunction} openWorkForm={() => setOpenWorkForm(false)} />
        </div>
      )}
      {openEducationForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EducationalDetailsForm
            openEducationForm={() => setOpenEducationForm(false)}
          />
        </div>
      )}
      {openSkillForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <SkillsInputForm data={skills} openSkillForm={() => setOpenSkillForm(false)} />
        </div>
      )}
      {openCertificationForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <CoursCertiForm
            openCertificationForm={() => setOpenCertificationForm(false)}
          />
        </div>
      )}
      {openProjectForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <ProjectForm openProjectForm={() => setOpenProjectForm(false)} />
        </div>
      )}
      {openLanguageForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <LanguageForm data={languages} openLanguageForm={() => setOpenLanguageForm(false)} />
        </div>
      )}
    </div>
  );
};

export default RightSide;
