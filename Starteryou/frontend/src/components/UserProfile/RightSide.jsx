import { useState, useEffect } from "react";
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

/**
 * RightSide component displaying user profile details such as work experience,
 * education, skills, certifications, projects, and languages. Also includes
 * modals for editing these details.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.getProfileFieldFunction - Function to fetch profile data dynamically
 * @returns {JSX.Element} RightSide component
 */
const RightSide = ({ getProfileFieldFunction }) => {
  const [workExperience, setWorkExperience] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);

  // State for pop-up modals
  const [openWorkForm, setOpenWorkForm] = useState(false);
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [openCertificationForm, setOpenCertificationForm] = useState(false);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [openLanguageForm, setOpenLanguageForm] = useState(false);

  // Function to fetch profile data dynamically
  const fetchProfileField = async (field, setState) => {
    try {
      const data = await getProfileFieldFunction(field);
      if (data) setState(data);
    } catch (error) {
      console.error(`Error fetching ${field}:`, error);
    }
  };

  // Fetch all fields on mount
  useEffect(() => {
    fetchProfileField("workExperience", setWorkExperience);
    fetchProfileField("educationDetails", setEducationDetails);
    fetchProfileField("skills", setSkills);
    fetchProfileField("certifications", setCertifications);
    fetchProfileField("projects", setProjects);
    fetchProfileField("languages", setLanguages);
  }, []);

  return (
    <div className="right">
      <WorkCard
        data={workExperience}
        getProfileFieldData={() =>
          fetchProfileField("workExperience", setWorkExperience)
        }
        openWorkForm={() => setOpenWorkForm(true)}
      />
      <EducationCard
        data={educationDetails}
        getProfileFieldData={() =>
          fetchProfileField("educationDetails", setEducationDetails)
        }
        openEducationForm={() => setOpenEducationForm(true)}
      />
      <SkillsCard
        data={skills}
        getProfileFieldData={() => fetchProfileField("skills", setSkills)}
        openSkillForm={() => setOpenSkillForm(true)}
      />
      <CoursCertiCard
        data={certifications}
        getProfileFieldData={() =>
          fetchProfileField("certifications", setCertifications)
        }
        openCertificationForm={() => setOpenCertificationForm(true)}
      />
      <ProjectCard
        data={projects}
        getProfileFieldData={() => fetchProfileField("projects", setProjects)}
        openProjectForm={() => setOpenProjectForm(true)}
      />
      <LanguagesCard
        data={languages}
        getProfileFieldData={() => fetchProfileField("languages", setLanguages)}
        openLanguageForm={() => setOpenLanguageForm(true)}
      />

      {/* Forms Pop-ups */}
      {openWorkForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
         justify-center z-50 overflow-y-scroll"
        >
          <WorkExperienceForm
            getProfileFieldData={() =>
              fetchProfileField("workExperience", setWorkExperience)
            }
            openWorkForm={() => setOpenWorkForm(false)}
          />
        </div>
      )}
      {openEducationForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EducationalDetailsForm
            getProfileFieldData={() =>
              fetchProfileField("educationDetails", setEducationDetails)
            }
            openEducationForm={() => setOpenEducationForm(false)}
          />
        </div>
      )}
      {openSkillForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <SkillsInputForm
            data={skills}
            getProfileFieldData={() => fetchProfileField("skills", setSkills)}
            openSkillForm={() => setOpenSkillForm(false)}
          />
        </div>
      )}
      {openCertificationForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <CoursCertiForm
            getProfileFieldData={() =>
              fetchProfileField("certifications", setCertifications)
            }
            openCertificationForm={() => setOpenCertificationForm(false)}
          />
        </div>
      )}
      {openProjectForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <ProjectForm
            getProfileFieldData={() =>
              fetchProfileField("projects", setProjects)
            }
            openProjectForm={() => setOpenProjectForm(false)}
          />
        </div>
      )}
      {openLanguageForm && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <LanguageForm
            data={languages}
            getProfileFieldData={() =>
              fetchProfileField("languages", setLanguages)
            }
            openLanguageForm={() => setOpenLanguageForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default RightSide;
