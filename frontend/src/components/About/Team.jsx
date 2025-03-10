import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";
import { FaLinkedin } from "react-icons/fa"; // Import the LinkedIn icon
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
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
      linkedin: `https://www.linkedin.com/in/mblingo/`,
    },
    {
      imgSrc: "/AboutPage/Team/cso.jpg",
      position: "CSO",
      name: "Anthony Ivanov",
      about: "In charge of technology and innovation.",
      linkedin: `https://www.linkedin.com/in/anthony-ivanov/`,
    },
    {
      imgSrc: "/AboutPage/Team/cto.jpg",
      position: "CTO",
      name: "Nikshep A Kulli",
      about: "Managing the company’s finances.",
      linkedin: "https://www.linkedin.com/in/nikshepkulli/",
    },
    // {
    //   imgSrc: "/AboutPage/Team/sales.jpg",
    //   position: "Research Analyst",
    //   name: "Ujjwal Geed",
    //   about: "Overseeing operations and strategies.",
    //   linkedin: "https://www.linkedin.com/in/ujwal-geed-8a0063218/",
    // },
    // {
    //   imgSrc: "/AboutPage/Team/market.jpg",
    //   position: "MARKETING MANAGER",
    //   name: "Miles Hill",
    //   about: "Leading the marketing team.",
    //   linkedin: "https://www.linkedin.com/in/miles-hill-04a355342/",
    // },
  ];

  const { isAdmin } = useNavigation(); // Get admin status from context
  const [teamMembers, setTeamMembers] = useState(initialData); // Current list of team members
  const [editingIndex, setEditingIndex] = useState(null); // Index of the member being edited
  const [editingData, setEditingData] = useState(null); // Data for editing a member
  const [fetchedImages, setFetchedImages] = useState({}); // Fetched images map
  const [isAdding, setIsAdding] = useState(false); // Toggle add form
  // State to hold the details of a new member being added
  const [newMember, setNewMember] = useState([]);

  // State to track whether the application is in a loading state
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Handles the addition of a new user by setting the `isAdding` state to true.
   * This triggers the necessary logic or UI updates to allow adding a new member.
   */
  const handleAddUser = () => {
    setIsAdding(true); // Set the flag to indicate the process of adding a user has started
  };

  /**
   * Deletes a team member by their index in the `teamMembers` array.
   *
   * This function sends a DELETE request to the server to remove a team member
   * identified by their unique `_id`. If the deletion is successful, the
   * team member is removed from the local `teamMembers` state. If an error
   * occurs, it displays an appropriate alert message.
   *
   * @async
   * @function handleDeleteUser
   * @param {number} index - The index of the team member in the `teamMembers` array.
   * @returns {Promise<void>} Resolves when the team member has been deleted and the state updated.
   *
   * @throws {Error} If an error occurs during the deletion process.
   *
   * @example
   * handleDeleteUser(2)
   *   .then(() => console.log("Deletion successful"))
   *   .catch(err => console.error(err));
   */
  const handleDeleteUser = async (index) => {
    const member = teamMembers[index];
    const memberId = member?._id; // Get _id from the member object

    if (!memberId) {
      alert("Error: Unable to delete. Member ID is missing.");
      return;
    }
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updatedMembers);
        alert("Team member deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the member. Please try again.");
      console.error(error);
    }
  };

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
                  about: response.data.paragraphs[0],
                  _id: response.data._id,
                  linkedin: member.linkedin, // Preserve LinkedIn URL
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
              // console.error(`Failed to fetch image for ${member.position}`);
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

  /**
   * Fetches team data from the server when the component mounts.
   *
   * This effect runs once after the component is rendered. It makes an API
   * call to fetch team data, updates the `teamMembers` state with the fetched
   * data, and stops the loading spinner once the operation is complete.
   *
   * @function useEffect
   * @async
   *
   * @example
   * useEffect(() => {
   *   // Code to fetch data from API and update state
   * }, []);
   */
  useEffect(() => {
    /**
     * Fetches team data from the API and updates the state.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>} Resolves when the data is fetched and state is updated.
     *
     * @throws {Error} If the API call fails, logs an error message to the console.
     */
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}?team=leaderteam`
        );
        // Check if the response status is OK (200)
        if (response.status === 200) {
          // Merge the existing state with the fetched data
          setTeamMembers((prevMembers) => [
            ...prevMembers,
            ...response.data.data,
          ]);
        }
      } catch (error) {
        // Log any errors encountered during the API call
        console.error("Error fetching team data:", error);
      } finally {
        // Set loading state to false once the fetch is complete
        setIsLoading(false);
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Dependency array ensures this runs only once when the component mounts

  /**
   * Saves a new team member to the server.
   *
   * This function validates the new member's details, sends them to the server
   * via a POST request, and updates the `teamMembers` state with the newly added
   * member if the operation is successful. If the validation fails or the server
   * request encounters an error, an appropriate alert message is shown.
   *
   * @async
   * @function handleSaveNewUser
   * @returns {Promise<void>} Resolves when the new member is successfully saved and the state is updated.
   *
   * @throws {Error} If the POST request fails, logs the error and shows an alert.
   *
   * @example
   * handleSaveNewUser()
   *   .then(() => console.log("New member saved"))
   *   .catch((err) => console.error(err));
   */
  const handleSaveNewUser = async () => {
    // Validate new member input fields
    if (
      !newMember.name ||
      !newMember.position ||
      !newMember.imageFile ||
      !newMember.linkedin
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Prepare form data for the POST request
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("position", newMember.position);
      formData.append("linkedin", newMember.linkedin);
      formData.append("image", newMember.imageFile);
      formData.append("team", "leaderteam"); // Assign the 'techteam' identifier
      // Send the POST request to save the new member
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const addedMember = response.data; // Assuming the response contains the new member
        // Add the new member to the `teamMembers` state
        setTeamMembers((prevMembers) => [...prevMembers, addedMember]);

        // Reset form state for adding a new member
        setNewMember({
          name: "",
          position: "",
          about: "",
          linkedin: "",
          image: "",
          imageFile: null,
        });

        setIsAdding(false);
        alert("Member added successfully!");
      }
    } catch (error) {
      console.error("Error saving new member:", error.response || error);
      alert("Failed to save the member.");
    }
  };

  return (
    <div className="bg-white py-20 px-4 text-center">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold mb-8 md:mb-10">
        Meet Our Leadership Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-[930px] mx-auto">
        {teamMembers.map((member, index) => {
          // Fetch image for both initial and new members
          const imgSrc =
            member.image && member.image.startsWith("data:image")
              ? member.image // Directly use the Base64 string
              : member.image && member.image.startsWith("/uploads")
              ? `${API_CONFIG.baseURL}${member.image}` // Handle uploaded images
              : fetchedImages[member.position] ||
                member.imgSrc ||
                "/AboutPage/Team/avatar.png"; // Fallback to other sources
          //for only Debugging
          // console.log("Image source for member:", member.name, imgSrc);

          return (
            <div
              key={index}
              className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md min-h-[350px] rounded-md relative"
            >
              <div className="relative group">
                <img
                  src={imgSrc} // Fallback to default if no image path is available
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
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:text-[#005582] mt-4 inline-block"
                >
                  <FaLinkedin size={24} />
                </a>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteUser(index)}
                  className="absolute top-2 right-2  bg-red-500 text-white rounded-full p-1"
                >
                  <AiOutlineClose size={20} />
                </button>
              )}
              {isAdmin && editingIndex !== index && (
                <button
                  className="absolute top-3 left-3 text-[#D9502E] hover:text-[#252B42]"
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
        {/* Add User Button */}
        {isAdmin && (
          <div
            onClick={handleAddUser}
            className="flex items-center justify-center bg-gradient-to-b from-[#D5E8FA] to-[#8B96E9] p-6 shadow-md min-h-[150px] rounded-md cursor-pointer"
          >
            <AiOutlinePlus size={40} className="text-[#252B42]" />
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white shadow-md rounded-md p-6 max-w-sm mx-auto w-full">
            <h3 className="text-lg font-bold mb-4">Add New Team Member</h3>
            <input
              type="file"
              accept="image/*"
              className="mb-3"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    // File size exceeds 2MB
                    alert(
                      "The file size must be less than 2MB. Please choose a smaller image."
                    );
                    return; // Prevent further processing
                  }
                  // File is valid, update state
                  setNewMember({
                    ...newMember,
                    imageFile: file,
                  });
                }
              }}
            />

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Position"
              className="border p-2 w-full mb-3"
              value={newMember.position}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  position: e.target.value.toUpperCase(),
                })
              }
            />

            <textarea
              placeholder="About"
              className="border p-2 w-full mb-3"
              value={newMember.about}
              onChange={(e) =>
                setNewMember({ ...newMember, about: e.target.value })
              }
            />

            <input
              type="url"
              placeholder="LinkedIn URL"
              className="border p-2 w-full mb-3"
              value={newMember.linkedin}
              onChange={(e) =>
                setNewMember({ ...newMember, linkedin: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveNewUser}
              >
                Save
              </button>
              <button
                className="text-red-500 mt-3"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Attaching runtime metadata to the component.
Team.metadata = {
  componentName: "Team",
  page: "AboutPage",
  description:
    "Displays team member profiles with their images, positions, and descriptions. Admins can edit details and upload new images.",
  editable: true,
  imageSupport: true,
  apiEndpoint: `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
};
export default Team;
