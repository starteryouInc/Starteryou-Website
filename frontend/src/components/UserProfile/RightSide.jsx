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
RightSide.metadata = {
  componentName: "RightSide",
  description:
    "A component displaying user profile details such as work experience, education, skills, certifications, projects, and languages. It includes modals for editing these details.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to edit profile details
    dynamicDataFetching: true, // Fetches profile data dynamically using provided function
    popUpModals: true, // Displays modals for editing profile sections
    inputValidation: true, // Validates input fields in forms
    toastNotifications: true, // Provides feedback on data fetch and save actions
  },
  data: {
    initialProfileData: {
      workExperience: [], // Initial state for work experience
      educationDetails: [], // Initial state for education details
      skills: [], // Initial state for skills
      certifications: [], // Initial state for certifications
      projects: [], // Initial state for projects
      languages: [], // Initial state for languages
    },
  },
  accessibility: {
    formLabels: "Labels are clearly associated with input fields for better accessibility.",
    modalAccessibility: "Pop-up modals are keyboard navigable and screen-reader friendly.",
  },
  styles: {
    container: {
      padding: "1rem", // Padding for the main container
      backgroundColor: "white", // Background color for the component
    },
    title: {
      fontSize: "1.5rem", // Font size for titles in cards
      fontWeight: "bold", // Font weight for titles in cards
    },
    buttons: {
      add: {
        backgroundColor: "#007BFF", // Background color for add buttons
        color: "white", // Text color for add buttons
      },
    },
  },
  apiEndpoints: {
    fetchProfileField: {
      method: "GET",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getProfileField(":field")}`, // Endpoint for fetching specific profile fields
      description: "Fetches specific profile field data dynamically.",
      requestParams: {
        field: "string", // The profile field to fetch (e.g., workExperience, skills)
      },
      successResponse: {
        status: 200,
        message: "Profile field fetched successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error fetching profile field.",
      },
    },
    updateProfileField: {
      method: "PATCH",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateProfileField(":field")}`, // Endpoint for updating specific profile fields
      description: "Updates specific profile field data.",
      requestBody: {
        field: "string", // The profile field to update (e.g., workExperience, skills)
        data: "object", // The data to update for the specified field
      },
      successResponse: {
        status: 200,
        message: "Profile field updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while updating profile field.",
      },
    },
  },
};
export default RightSide;
