/**
 * `TechTeam` component that displays information about the tech team, including an editable header, intro paragraph,
 * and team member details. The content can be fetched from an API and saved back with editing enabled only for admins.
 *
 * @component
 *
 * @returns {JSX.Element} A component that displays the tech team details, with options for admins to edit and save content.
 */
import { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import axios from "axios"; // Library for making HTTP requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Icon component from FontAwesome
import { faPencilAlt, faSave } from "@fortawesome/free-solid-svg-icons"; // Specific icons for edit and save functionality
import { useNavigation } from "../../context/NavigationContext"; // Custom context for managing navigation and admin state
import { API_CONFIG } from "@config/api";

/**
 * TechTeam component for displaying tech team information.
 *
 * @function TechTeam
 * @returns {JSX.Element} The rendered component.
 */
const TechTeam = () => {
  /**
   * State to store the main content title.
   * @type {[string, function]}
   */
  const [content, setContent] = useState("Our Tech Team");

  /**
   * State to store paragraphs for intro and team members.
   * @type {[string[], function]}
   */
  const [paragraphs, setParagraphs] = useState([
    "Intro paragraph here", // Placeholder for intro paragraph
    "Title for member 1", // Placeholder for member 1's title
    "Rohit Kumar", // Placeholder for member 1's name
    "About for member 1", // Placeholder for member 1's about
    "Title for member 2", // Placeholder for member 2's title
    "Name for member 2", // Placeholder for member 2's name
    "About for member 2", // Placeholder for member 2's about
  ]);

  /**
   * State to track whether editing mode is enabled.
   * @type {[boolean, function]}
   */
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage"; // Specify the page name for the current component.
  /**
   * Retrieve admin status from navigation context.
   * @type {object}
   * @property {boolean} isAdmin - Boolean value to determine if the current user is an admin.
   */
  const { isAdmin } = useNavigation();

  /**
   * Fetch data from the API when the component mounts.
   * This function retrieves text content and paragraphs for the TechTeam component.
   */
  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "TechTeam" }, // Specify the component name for fetching content
          }
        );
        const { content, paragraphs } = response.data;

        // Set fetched content and paragraphs, fallback to placeholders if data is missing
        setContent(content || "Our Tech Team");
        setParagraphs(paragraphs || []);
      } catch {
        console.error("Error fetching text content"); // Log errors to the console
      }
    };

    fetchTextContent(); // Trigger data fetch
  }, []);

  /**
   * Save the updated content to the API.
   * This function sends the modified content and paragraphs back to the server for saving.
   */
  const saveContent = async () => {
    try {
      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "HomePage",

        component: "TechTeam", // Specify the component name for saving content
        content: content.trim(), // Trim whitespace from the title
        paragraphs: paragraphs.map((para) => para.trim()), // Trim whitespace for each paragraph
      });

      // Exit editing mode after successful save
      setIsEditing(false);
    } catch {
      console.error("Error saving content"); // Log errors to the console
    }
  };

  /**
   * Team member data array.
   * @type {Array<{imgSrc: string, position: string, name: string, about: string}>}
   */
  const teamMembers = [
    {
      imgSrc: "/AboutPage/TechTeam/rohit1.jpg", // Path to the first member's image
      position: paragraphs[1] || "Title", // Title for the first member
      name: paragraphs[2] || "Rohit Kumar BR", // Name for the first member
      about: paragraphs[3] || "The quick fox jumps over the lazy dog.", // About section for the first member
    },
    {
      imgSrc: "/AboutPage/TechTeam/member2.jpg", // Path to the second member's image
      position: paragraphs[4] || "Title", // Title for the second member
      name: paragraphs[5] || "Lorem Ipsum", // Name for the second member
      about: paragraphs[6] || "The quick fox jumps over the lazy dog.", // About section for the second member
    },
  ];

  return (
    <div className="flex flex-col items-center py-12 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-center mb-4">
        {/* Editable content header */}
        <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold text-center mr-2">
          {isEditing ? (
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
            />
          ) : (
            content
          )}
        </h2>

        {/* Edit/Save button visible to admin */}
        {isAdmin && (
          <FontAwesomeIcon
            icon={isEditing ? faSave : faPencilAlt} // Toggle icon based on editing state
            className="text-blue-500 cursor-pointer"
            onClick={isEditing ? saveContent : () => setIsEditing(true)} // Handle click events
          />
        )}
      </div>

      {/* Intro Paragraph Section */}
      <p className="text-center text-[#737373] mb-10 max-w-lg">
        {isEditing ? (
          <textarea
            value={paragraphs[0] || ""}
            onChange={(e) =>
              setParagraphs((prev) => {
                const updated = [...prev];
                updated[0] = e.target.value; // Update the intro paragraph
                return updated;
              })
            }
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          />
        ) : (
          paragraphs[0] ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        )}
      </p>

      {/* Team Members Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white max-w-sm"
          >
            {/* Member Image */}
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4"
            />

            {/* Member Details */}
            <h3 className="text-xl font-semibold text-[#2C9DDD]">
              {isEditing ? (
                <input
                  type="text"
                  value={paragraphs[index * 3 + 1] || ""}
                  onChange={(e) =>
                    setParagraphs((prev) => {
                      const updated = [...prev];
                      updated[index * 3 + 1] = e.target.value; // Update position
                      return updated;
                    })
                  }
                  className="border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center py-1 px-2 rounded-md shadow-sm transition-all duration-200"
                />
              ) : (
                member.position
              )}
            </h3>

            <p className="text-lg font-semibold text-[#252B42]">
              {isEditing ? (
                <input
                  type="text"
                  value={paragraphs[index * 3 + 2] || ""}
                  onChange={(e) =>
                    setParagraphs((prev) => {
                      const updated = [...prev];
                      updated[index * 3 + 2] = e.target.value; // Update name
                      return updated;
                    })
                  }
                  className="border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                />
              ) : (
                member.name
              )}
            </p>

            <p className="text-center text-[#737373] mt-2">
              {isEditing ? (
                <textarea
                  value={paragraphs[index * 3 + 3] || ""}
                  onChange={(e) =>
                    setParagraphs((prev) => {
                      const updated = [...prev];
                      updated[index * 3 + 3] = e.target.value; // Update about
                      return updated;
                    })
                  }
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-3 rounded-md shadow-sm transition-all duration-200"
                />
              ) : (
                member.about
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechTeam;
