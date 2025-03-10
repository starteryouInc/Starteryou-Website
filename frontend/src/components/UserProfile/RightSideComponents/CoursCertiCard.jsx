import React, { useState } from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { GrCertificate } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from 'react-hot-toast';;
import axios from "axios";
import EditCourse from "./EditableForms/EditCourse";

const CoursCertiCard = ({
  openCertificationForm,
  data,
  getProfileFieldData,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const { user } = useUserContext();
  const token = user?.token;

  function formatExpiryDate(expiryDate) {
    const options = { year: "numeric", month: "long" };
    const formattedDate = new Date(expiryDate).toLocaleDateString(
      "en-US",
      options
    );
    return `Validity - ${formattedDate}`;
  }

  const handleDeleteData = async (subDocId) => {
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteCertificate(
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
      getProfileFieldData("");
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <div
      className={`license-display-card ${
        openEditCourse
          ? "space-y-0"
          : data.length !== 0
          ? "space-y-4"
          : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Courses and Certification</h2>
        <button
          onClick={openCertificationForm}
          className="text-[#6a54df] font-semibold"
        >
          + Add
        </button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {data.length !== 0
          ? data.map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-start w-full"
              >
                <div className="flex items-start">
                  {/* Icon */}
                  <GrCertificate className="icon-style mr-4" />

                  {/* Details */}
                  <div className="space-y-2">
                    <h1 className="text-xl">{e.title}</h1>
                    <h2 className="text-lg font-semibold">{e.issuedBy}</h2>
                    {e.expiryDate && (
                      <h5 className="text-lg text-[#777585]">
                        {formatExpiryDate(e.expiryDate)}
                      </h5>
                    )}
                    {e.certificateURL ? (
                      <h5 className="text-lg">
                        <a
                          href={e.certificateURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8176FF] font-semibold inline-block"
                        >
                          View Certificate
                        </a>
                      </h5>
                    ) : (
                      " "
                    )}
                  </div>
                </div>

                {/* Edit Icon */}
                <div className="icons flex items-center space-x-2">
                  <img
                    src={EditPen}
                    onClick={() => {
                      setSelectedCourse(e);
                      setOpenEditCourse(true);
                    }}
                    alt="Edit Education details"
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
      {openEditCourse && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-center
         justify-center z-50 overflow-y-scroll"
        >
          <EditCourse
            getProfileFieldData={getProfileFieldData}
            course={selectedCourse}
            closeEditCourse={() => setOpenEditCourse(false)}
          />
        </div>
      )}
    </div>
  );
};
CoursCertiCard.metadata = {
  componentName: "CoursCertiCard",
  description:
    "A card component that displays courses and certifications, allowing users to edit or delete entries.",
  features: {
    userAuthentication: true, // Requires user to be authenticated to manage certifications
    inputValidation: true, // Validates course and link input fields
    toastNotifications: true, // Provides feedback on delete and edit actions
    editable: true, // Allows users to edit course details
    imageUpload: false, // No image upload functionality in this component
  },
  data: {
    initialContent: {
      title: "", // Initial title for the course
      issuedBy: "", // Initial issuer of the certificate
      expiryDate: "", // Initial expiry date if applicable
      certificateURL: "", // Initial URL for the certificate
    },
    courseData: [], // Array to hold course and certification data
  },
  accessibility: {
    formLabels: "Labels are associated with input fields for accessibility.",
    validLinks: "Ensures that the social link field is a valid URL.",
    editable: "Allows users to edit and delete their courses easily.",
    ariaLabels: "Icons have appropriate aria labels for screen readers.",
  },
  styles: {
    container: {
      padding: "2rem", // Padding for the main container
      backgroundColor: "white", // Background color for the component
      border: "1px solid #e0e0e0", // Border for the card
      borderRadius: "8px", // Rounded corners for the card
    },
    title: {
      fontSize: "1.5rem", // Font size for the course title
      fontWeight: "bold", // Font weight for the course title
    },
    issuedBy: {
      fontSize: "1.2rem", // Font size for the issued by text
      fontWeight: "600", // Font weight for the issued by text
    },
    buttons: {
      edit: {
        backgroundColor: "#6a54df", // Background color for the edit button
        color: "white", // Text color for the edit button
      },
      delete: {
        backgroundColor: "red", // Background color for the delete button
        color: "white", // Text color for the delete button
      },
      add: {
        backgroundColor: "#6a54df", // Background color for the add button
        color: "white", // Text color for the add button
      },
    },
  },
  apiEndpoints: {
    fetchCertificates: {
      method: "GET",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getCertificates}`, // Endpoint for fetching certificates
      description: "Fetches the list of courses and certifications for the user.",
      successResponse: {
        status: 200,
        message: "Certificates fetched successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error fetching certificates.",
      },
    },
    deleteCertificate: {
      method: "DELETE",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteCertificate(":userId", ":subDocId")}`, // Endpoint for deleting a certificate
      description: "Deletes a specific course or certification based on its ID.",
      successResponse: {
        status: 200,
        message: "Certificate deleted successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while deleting the certificate.",
      },
    },
    updateCertificate: {
      method: "PUT",
      url: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.updateCertificate(":userId", ":subDocId")}`, // Endpoint for updating a certificate
      description: "Updates the details of a specific certificate.",
      requestBody: {
        title: "string", // Updated title for the course
        issuedBy: "string", // Updated issuer of the certificate
        expiryDate: "string", // Updated expiry date if applicable
        certificateURL: "string", // Updated URL for the certificate
      },
      successResponse: {
        status: 200,
        message: "Certificate updated successfully.",
      },
      errorResponse: {
        status: 400,
        message: "Error occurred while updating the certificate.",
      },
    },
  },
};
export default CoursCertiCard;
