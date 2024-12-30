import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { FaLinkedin } from "react-icons/fa"; // Import the LinkedIn icon
/**
 * Team Component
 *
 * Displays team member profiles with their images, positions, and descriptions.
 * Admin users can edit team member details and upload new images.
 *
 * Dependencies:
 * - `useState`, `useEffect` (React): Manage state and lifecycle events.
 * - `axios`: Perform API requests for fetching and updating data.
 * - `react-icons`: Provides edit icon (`FiEdit2`).
 * - `useNavigation`: Provides admin status from context.
 * - `API_CONFIG`: API configuration for fetching and updating data.
 *
 * State:
 * - `teamMembers`: Array of team members with details.
 * - `editingIndex`: Index of the team member being edited.
 * - `editingData`: Temporary data for editing a team member.
 * - `fetchedImages`: Map of fetched image URLs for team members.
 */
const Team = () => {
  // Initial static data for team members
  const initialData = [
    {
      imgSrc: "/AboutPage/Team/ceo.jpg",
      position: "CEO",
      name: "Michael Berlingo",
      about: "Leading the company with a vision.",
      linkedinUrl: `https://www.linkedin.com/in/mblingo/`,
    },
    {
      imgSrc: "/AboutPage/Team/cso.jpg",
      position: "CSO",
      name: "Anthony Ivanov",
      about: "In charge of technology and innovation.",
      linkedinUrl: `https://www.linkedin.com/in/anthony-ivanov/`,
    },
    {
      imgSrc: "/AboutPage/Team/cto.jpg",
      position: "CTO",
      name: "Nikshep A Kulli",
      about: "Managing the company’s finances.",
      linkedinUrl: "https://www.linkedin.com/in/nikshepkulli/",
    },
    {
      imgSrc: "/AboutPage/Team/sales.jpg",
      position: "SALES OFFICER",
      name: "Ujjwal Geed",
      about: "Overseeing operations and strategies.",
      linkedinUrl: "https://www.linkedin.com/in/ujwal-geed-8a0063218/",
    },
    {
      imgSrc: "/AboutPage/Team/market.jpg",
      position: "MARKETING MANAGER",
      name: "Miles Hill",
      about: "Leading the marketing team.",
      linkedinUrl: "https://www.linkedin.com/in/miles-hill-04a355342/",
    },
  ];

  const { isAdmin } = useNavigation(); // Get admin status from context
  const [teamMembers, setTeamMembers] = useState(initialData); // Current list of team members
  const [editingIndex, setEditingIndex] = useState(null); // Index of the member being edited
  const [editingData, setEditingData] = useState(null); // Data for editing a member
  const [fetchedImages, setFetchedImages] = useState({}); // Fetched images map

  /**
   * Fetches team data from the API on mount and updates `teamMembers` state.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedMembers = await Promise.all(
          initialData.map(async (member) => {
            try {
              const response = await axios.get(
                `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
                { params: { page: "AboutPage", component: member.position } }
              );

              if (response.data && response.data.component) {
                // Replace initial data with API response
                return {
                  imgSrc: response.data.image || member.imgSrc,
                  position: response.data.component,
                  name: response.data.content,
                  about:
                    response.data.paragraphs[0] ||
                    "No additional information available.",
                  _id: response.data._id,
                  linkedinUrl: member.linkedinUrl, // Preserve LinkedIn URL
                };
              }
              return member; // Fallback to initial data if API call fails
            } catch (error) {
              console.error(
                `Error fetching data for ${member.position}:`,
                error
              );
              return member;
            }
          })
        );

        setTeamMembers(updatedMembers);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * Saves updated team member data to the API and updates the state.
   * @param {number} index - Index of the member being updated.
   */
  const saveUpdatedData = async (index) => {
    try {
      const member = editingData;
      const payload = {
        page: "AboutPage",
        component: member.position,
        content: member.name,
        paragraphs: [member.about],
      };

      await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        payload
      );

      const updatedMembers = [...teamMembers];
      updatedMembers[index] = member;
      setTeamMembers(updatedMembers); // Update the team member list

      setEditingIndex(null); // Exit editing mode
    } catch (error) {
      console.error("Error saving updated data:", error);
    }
  };

  /**
   * Handles image upload for a team member and updates their image in the state.
   * @param {number} index - Index of the member whose image is being uploaded.
   * @param {File} file - The uploaded image file.
   */
  const handleImageUpload = async (index, file) => {
    const member = teamMembers[index];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", member.position);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(
          member.position
        )}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedMembers = [...teamMembers];
        updatedMembers[index].imgSrc = URL.createObjectURL(file);
        setTeamMembers(updatedMembers);
        alert("Image uploaded successfully!");
      } else {
        console.error("Image upload failed");
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  /**
   * Fetches uploaded images for team members from the API.
   */
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const imagePromises = teamMembers.map(async (member) => {
          try {
            const response = await fetch(
              `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(
                member.position
              )}`
            );

            if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              return { position: member.position, imgSrc: url };
            } else {
              console.error(`Failed to fetch image for ${member.position}`);
              return null;
            }
          } catch (error) {
            console.error(
              `Error fetching image for ${member.position}:`,
              error
            );
            return null;
          }
        });

        const images = await Promise.all(imagePromises);
        const imageMap = images.reduce((acc, img) => {
          if (img) acc[img.position] = img.imgSrc;
          return acc;
        }, {});
        setFetchedImages(imageMap); // Update fetched images
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
      }
    };

    fetchUploadedFiles();
  }, [teamMembers]);

  return (
    <div className="bg-white py-20 px-4 text-center">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold mb-8 md:mb-10">
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-[930px] mx-auto">
        {teamMembers.map((member, index) => {
          const imgSrc = fetchedImages[member.position] || member.imgSrc;
          return (
            <div
              key={index}
              className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md min-h-[350px] rounded-md relative"
            >
              <div className="relative group">
                <img
                  src={imgSrc}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                {isAdmin && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleImageUpload(index, e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>

              <h3 className="text-xl font-semibold text-[#D9502E] mb-2">
                {member.position}
              </h3>

              {editingIndex === index ? (
                <>
                  <input
                    className="text-lg font-semibold border-b-2 border-[#252B42] mb-2 outline-none"
                    value={editingData.name}
                    onChange={(e) =>
                      setEditingData({ ...editingData, name: e.target.value })
                    }
                  />
                  <textarea
                    className="text-gray-600 border-b-2 border-[#252B42] w-full outline-none"
                    value={editingData.about}
                    onChange={(e) =>
                      setEditingData({ ...editingData, about: e.target.value })
                    }
                  />
                  <button
                    className="bg-blue-500 text-white py-1 px-4 mt-2 rounded"
                    onClick={() => saveUpdatedData(index)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h4>
                  <p className="text-gray-600 whitespace-pre-wrap ">
                    {member.about}
                  </p>
                </>
              )}
              {/* LinkedIn icon  */}
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:text-[#005582] mt-4 inline-block"
                >
                  <FaLinkedin size={24} />
                </a>
              )}

              {isAdmin && editingIndex !== index && (
                <button
                  className="absolute top-3 right-3 text-[#D9502E] hover:text-[#252B42]"
                  onClick={() => {
                    setEditingIndex(index);
                    setEditingData({ ...member });
                  }}
                >
                  <FiEdit2 size={20} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
