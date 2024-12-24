import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { useNavigation } from "../../context/NavigationContext";
import { API_CONFIG } from "@config/api";

/**
 * The Team component displays a list of team members, their positions, names, and about text.
 * It allows admins to edit the details of each member.
 *
 * Data is fetched from a backend API, and the component supports editing and saving changes.
 *
 * @component
 * @example
 * return (
 *   <Team />
 * )
 */
const Team = () => {
  /**
   * Initial data for team members. Used as fallback if no data is fetched.
   * @type {Array<Object>}
   * @property {string} imgSrc - The image source URL of the team member.
   * @property {string} position - The position or title of the team member.
   * @property {string} name - The name of the team member.
   * @property {string} about - A short description about the team member.
   */
  const initialData = [
    {
      imgSrc: "/AboutPage/Team/ceo.jpg",
      position: "CEO",
      name: "Michael Berlingo",
      about: "Leading the company with a vision.",
    },
    {
      imgSrc: "/AboutPage/Team/cso.jpg",
      position: "CSO",
      name: "Anthony Ivanov",
      about: "In charge of technology and innovation.",
    },
    {
      imgSrc: "/AboutPage/Team/cto.jpg",
      position: "CTO",
      name: "Nikshep A Kulli",
      about: "Managing the company’s finances.",
    },
    {
      imgSrc: "/AboutPage/Team/sales.jpg",
      position: "SALES OFFICER",
      name: "Ujjwal Geed",
      about: "Overseeing operations and strategies.",
    },
    {
      imgSrc: "/AboutPage/Team/market.jpg",
      position: "MARKETING MANAGER",
      name: "Rushikesh Balkrushna Solanke",
      about: "Leading the marketing team.",
    },
  ];

  const { isAdmin } = useNavigation(); // Extracts admin status from the NavigationContext.

  const [teamMembers, setTeamMembers] = useState(initialData); // Holds team member data.
  const [editingIndex, setEditingIndex] = useState(null); // Tracks which team member is being edited.
  const [editingData, setEditingData] = useState(null); // Temporary state for edited data.
  const page = "AboutPage"; // Specify the page name for the current component.
  /**
   * Fetches team member data from the backend and updates the state.
   * @async
   * @function
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = initialData.map(async (member) => {
          if (!member.position) {
            console.error("No position found for member:", member);
            return member; // Return initial data if position is missing.
          }

          try {
            const response = await axios.get(
              `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
              {
                params: { page, component: member.position },
              }
            );

            if (response.data && response.data.component) {
              return {
                imgSrc: response.data.image || member.imgSrc, // Use fetched image or fallback to initial.
                position: response.data.component,
                name: response.data.content,
                about:
                  response.data.paragraphs[0] ||
                  "No additional information available.", // Fallback text if no paragraphs.
                _id: response.data._id,
              };
            } else {
              console.warn(
                `No data found for ${member.position}, using initial data.`
              );
              return member;
            }
          } catch {
            console.error(`Error fetching data for ${member.position}:`);
            return member; // Return initial data if fetching fails.
          }
        });

        const updatedMembers = await Promise.all(fetchPromises);
        setTeamMembers(updatedMembers); // Update state with fetched or fallback data.
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * Saves the updated data of the edited team member to the backend.
   * @async
   * @param {number} index - The index of the team member being updated.
   */
  const saveUpdatedData = async (index) => {
    try {
      const member = editingData; // The member currently being edited.
      const payload = {
        page: "AboutPage",
        component: member.position,
        content: member.name,
        paragraphs: [member.about],
      };

      // Sends a PUT request to save the edited data.
      await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        payload
      );

      const updatedMembers = [...teamMembers];
      updatedMembers[index] = member; // Update the specific member in the state.
      setTeamMembers(updatedMembers);

      setEditingIndex(null); // Reset the editing index after save.
    } catch {
      console.error("Error saving updated data");
    }
  };

  return (
    <div className="bg-white py-20 px-4 text-center">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold mb-8 md:mb-10">
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-[930px] mx-auto">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md min-h-[350px] rounded-md relative"
          >
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
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
                  className="mt-4 bg-[#252B42] text-white py-1 px-4 rounded"
                  onClick={() => saveUpdatedData(index)}
                >
                  Save
                </button>
                <button
                  className="mt-2 text-red-500"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-lg mb-3 font-semibold text-[#252B42]">
                  {member.name}
                </p>
                <p className="text-gray-600">{member.about}</p>
              </>
            )}
            {isAdmin && (
              <FiEdit2
                className="absolute top-4 right-4 text-[#252B42] cursor-pointer"
                onClick={() => {
                  setEditingIndex(index);
                  setEditingData(member);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
