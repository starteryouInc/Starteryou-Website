import { useState, useEffect } from "react";
import { FaLinkedin, FaPlus } from "react-icons/fa";
import axios from "axios";
import { API_CONFIG } from "@config/api";
import { useNavigation } from "../../context/NavigationContext";
import { AiOutlineClose } from "react-icons/ai";
const TechTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const { isAdmin } = useNavigation(); // Get admin status from context
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    about: "",
    image: null,
    linkedin: "",
  });

  // Fetch only Tech Team members
  useEffect(() => {
    axios
      .get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}?team=techteam`)
      .then((response) => {
        setTeamMembers(response.data.data);
      })
      .catch((error) => console.error("Error fetching team members:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSave = async () => {
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("position", formData.position);
    formDataObj.append("image", formData.image);
    formDataObj.append("linkedin", formData.linkedin);
    formDataObj.append("team", "techteam"); // Assign the 'techteam' identifier

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setTeamMembers((prev) => [...prev, response.data]);
      // Reset formData to its initial state
      setFormData({
        name: "",
        position: "",
        about: "",
        image: null,
        linkedin: "",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving team member:", error);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.teamApi}/${id}`
      );
      setTeamMembers((prev) => prev.filter((member) => member._id !== id)); // Remove the deleted member from state
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold mb-4 text-center">
        Our Tech Team
      </h2>
      <p className="text-center text-[#737373] mb-10 max-w-lg">
        Meet the visionaries behind the code — our Tech Team, blending
        creativity and precision to bring groundbreaking ideas to life.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <div
            key={member._id} // Use unique ID instead of index
            className="relative flex flex-col items-center p-6 bg-white max-w-sm"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-[#2C9DDD] mb-1">
              {member.position}
            </h3>
            <p className="text-lg font-semibold text-[#252B42]">
              {member.name}
            </p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077b5] hover:text-[#005582] mt-4 inline-block"
            >
              <FaLinkedin size={24} />
            </a>
            {isAdmin && (
              <button
                onClick={() => handleDeleteUser(member._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <AiOutlineClose size={20} />
              </button>
            )}
          </div>
        ))}
        {isAdmin && (
          <div
            className="flex flex-col items-center justify-center p-6 bg-white max-w-sm cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <FaPlus size={48} className="text-[#252B42]" />
            <p className="mt-4 text-lg font-semibold text-[#252B42]">
              Add Member
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">Add New Member</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-2 uppercase"
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-2"
              required
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-2 rounded mb-2"
              required
            />
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTeam;
