import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { useNavigation } from "../../context/NavigationContext";
const Team = () => {
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
  const { isAdmin } = useNavigation();
  const [teamMembers, setTeamMembers] = useState(initialData);
  const [editingIndex, setEditingIndex] = useState(null); // Index of the currently editing member
  const [editingData, setEditingData] = useState(null); // Temporary state for editing

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = initialData.map(async (member) => {
          if (!member.position) {
            console.error("No position found for member:", member);
            return member; // If no position, return the initial data
          }

          try {
            const response = await axios.get("http://localhost:3000/api/text", {
              params: { component: member.position },
            });

            // If the response is valid and contains data
            if (response.data && response.data.component) {
              return {
                imgSrc: response.data.image || member.imgSrc, // Use fetched image or fallback to initial
                position: response.data.component, // Assuming `component` is the position
                name: response.data.content,
                about:
                  response.data.paragraphs[0] ||
                  "No additional information available.", // Fallback to a default message if no paragraphs
                _id: response.data._id,
              };
            } else {
              console.warn(
                `No data found for ${member.position}, using initial data.`
              );
              return member; // If no data is found, return the initial member
            }
          } catch (error) {
            // If fetch fails (e.g., 404), fall back to initial data for that member
            console.error(`Error fetching data for ${member.position}:`, error);
            return member; // Return the initial data if fetch fails
          }
        });

        // Wait for all fetch promises to resolve
        const updatedMembers = await Promise.all(fetchPromises);

        // Update the state with the results (either fetched data or initial data)
        setTeamMembers(updatedMembers);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, []); // Runs only once when the component is mounted

  // Save updated data
  const saveUpdatedData = async (index) => {
    try {
      const member = editingData; // Get the member currently being edited
      const payload = {
        component: member.position, // Position will be sent as `component`
        content: member.name,
        paragraphs: [member.about],
      };

      // Sending the PUT request with the updated payload
      await axios.put(`http://localhost:3000/api/text`, payload);

      // Update the local state with the edited data
      const updatedMembers = [...teamMembers];
      updatedMembers[index] = member; // Update the specific member
      setTeamMembers(updatedMembers);

      // Reset the editing index after save
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving updated data:", error);
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
            className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md h-[350px] rounded-md relative"
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
