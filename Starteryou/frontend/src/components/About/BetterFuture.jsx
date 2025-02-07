import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigation } from "../../context/NavigationContext";
import {
  faPlay,
  faPause,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_CONFIG } from "@config/api";
import { MaxWords } from "../Common/wordValidation";

/**
 * `BetterFuture` Component
 *
 * A component that displays a video with play/pause functionality, dynamic heading and paragraph content, and allows admins to edit and save the content.
 * The content is fetched from an API on mount, and updates are saved back to the API.
 */
const BetterFuture = () => {
  // State to control video play/pause
  const [isPlaying, setIsPlaying] = useState(false);

  // State for managing heading text
  const [content, setContent] = useState("Build Better Future");

  // State for managing paragraph content
  const [paragraphs, setParagraphs] = useState([
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..",
    "Most trusted in our field",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Title 1",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Title 2",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  ]);

  // State for toggling edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Reference for the video element
  const videoRef = useRef(null);

  // Check if the user is an admin
  const { isAdmin } = useNavigation();
  const page = "AboutPage"; // Specify the page name for the current component.
  const [titleWordsLeft, setTitleWordsLeft] = useState(4); // Counter for the title
  const [paragraphWordsLeft, setParagraphWordsLeft] = useState(44); // Counter for the paragraph
  /**
   * Fetches the text content from the backend API.
   * Updates the heading and paragraph states with the fetched data.
   */
  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
          {
            params: { page, component: "BetterFuture" }, // Identifies the component in the backend
          }
        );

        // Update content and paragraphs with fetched data
        const { content, paragraphs } = response.data;
        setContent(content || "Build Better Future");
        setParagraphs(paragraphs || []);
      } catch {
        console.error("Error fetching text content");
      }
    };

    fetchTextContent(); // Trigger the fetch function
  }, []); // Dependency array is empty, so this runs only once

  /**
   * Toggles the play/pause state of the video.
   */
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause(); // Pause video if playing
    } else {
      videoRef.current.play(); // Play video if paused
    }
    setIsPlaying(!isPlaying); // Toggle play state
  };

  /**
   * Toggles the edit mode for the content (heading and paragraphs).
   */
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Saves the updated content to the backend API.
   * Sends the content and paragraphs to the backend.
   */
  const saveContent = async () => {
    try {
      await axios.put(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`, {
        page: "AboutPage",
        component: "BetterFuture",
        content: content.trim(), // Trim whitespace from content
        paragraphs: paragraphs.map((para) => para.trim()), // Trim each paragraph
      });
      setIsEditing(false); // Exit editing mode on success
    } catch {
      console.error("Error saving content");
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto text-center p-6 pt-24 md:pb-12">
      {/* Heading Section */}
      <div className="relative">
        {isEditing ? (
          <>
            <span className="text-gray-500 text-sm">
              {titleWordsLeft >= 0
                ? `${titleWordsLeft} words left`
                : `Word limit exceeded by ${Math.abs(titleWordsLeft)} words`}
            </span>
            <input
              type="text"
              value={content} // Controlled input for editing heading
              onChange={(e) =>
                setContent(MaxWords(e.target.value, 4, setTitleWordsLeft))
              }
              className="text-4xl font-bold md:font-extrabold mb-4 text-[#252B42] border border-gray-300 p-2 rounded w-full"
            />
          </>
        ) : (
          <h1 className="text-4xl font-bold md:font-extrabold mb-4 text-[#252B42]">
            {content}
          </h1>
        )}

        {/* Edit icon visible only for admins */}
        {isAdmin && (
          <FontAwesomeIcon
            icon={faPencilAlt}
            onClick={handleEditToggle} // Toggle edit mode on click
            className="absolute top-0 right-0 text-gray-500 cursor-pointer"
          />
        )}
      </div>

      {/* Description Section */}
      {isEditing ? (
        <>
          <span className="text-gray-500 text-sm">
            {paragraphWordsLeft >= 0
              ? `${paragraphWordsLeft} words left`
              : `Word limit exceeded by ${Math.abs(paragraphWordsLeft)} words`}
          </span>
          <textarea
            value={paragraphs[0]} // Controlled textarea for first paragraph
            onChange={(e) =>
              setParagraphs((prev) => {
                const updated = [...prev];
                updated[0] = MaxWords(
                  e.target.value,
                  44,
                  setParagraphWordsLeft
                ); // Update specific paragraph
                return updated;
              })
            }
            className="text-[#737373] mb-8 md:mb-14 max-w-[600px] mx-auto border border-gray-300 p-2 rounded w-full"
            rows={4}
          />
        </>
      ) : (
        <p className="text-[#737373] mb-8 md:mb-14 max-w-[600px] mx-auto whitespace-pre-wrap">
          {paragraphs[0]}
        </p>
      )}

      {/* Content Section with Video and Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 py-5 md:py-10">
        {/* Video Box */}
        <div className="relative w-full h-auto">
          <div className="relative overflow-hidden rounded-sm shadow-lg">
            <video
              ref={videoRef} // Reference to control the video
              className="w-full h-[300px] md:h-[400px] object-cover"
              controls={false} // Disable default controls
            >
              <source
                src="/AboutPage/8471681-sd_640_338_25fps.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause} // Trigger play/pause functionality
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 hover:bg-opacity-50 transition-all duration-300"
            >
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay} // Show play/pause icon
                  className="text-white text-2xl"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Text Box */}
        <div className="flex flex-col bg-white p-2 md:p-6 justify-center">
          {/* Display editable or static content */}
          <h2 className="text-3xl font-semibold text-start text-[#252B42] pb-3">
            {isEditing ? (
              <textarea
                value={paragraphs[1]} // Editable second paragraph
                onChange={(e) =>
                  setParagraphs((prev) => {
                    const updated = [...prev];
                    updated[1] = e.target.value;
                    return updated;
                  })
                }
                className="text-[#737373] text-start max-w-[400px] text-base pb-6 border border-gray-300 p-2 rounded w-full"
                rows={3}
              />
            ) : (
              <span className="whitespace-pre-wrap">{paragraphs[1]}</span>
            )}
          </h2>

          <p className="text-[#737373] text-start max-w-[454px] text-base pb-6">
            {isEditing ? (
              <textarea
                value={paragraphs[2]} // Editable third paragraph
                onChange={(e) =>
                  setParagraphs((prev) => {
                    const updated = [...prev];
                    updated[2] = MaxWords(e.target.value, 25);
                    return updated;
                  })
                }
                className="text-[#737373] text-start max-w-[454px] text-base pb-6 border border-gray-300 p-2 rounded w-full whitespace-pre-wrap"
                rows={3}
              />
            ) : (
              <span className="whitespace-pre-wrap">{paragraphs[2]}</span>
            )}
          </p>

          {/* Editable small boxes */}
          <div className="mt-6 space-y-4">
            {[3, 5].map((titleIndex, idx) => (
              <div key={titleIndex} className="flex items-center space-x-4">
                <img
                  src={`/AboutPage/better${idx + 1}.svg`}
                  alt={`Image ${idx + 1}`}
                  className="w-7 h-7 object-cover"
                />
                <div>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={paragraphs[titleIndex]} // Title input
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[titleIndex] = MaxWords(e.target.value, 5);
                          setParagraphs(updated);
                        }}
                        className="text-xl text-left font-semibold max-w-[400px] text-[#252B42] border border-gray-300 p-2 rounded w-full whitespace-pre-wrap "
                      />
                      <textarea
                        value={paragraphs[titleIndex + 1]} // Paragraph input
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[titleIndex + 1] = MaxWords(
                            e.target.value,
                            17
                          );
                          setParagraphs(updated);
                        }}
                        className="text-[#737373] text-left max-w-[400px] text-sm border border-gray-300 p-2 rounded w-full"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl text-left max-w-[400px] font-semibold text-[#252B42] whitespace-pre-wrap">
                        {paragraphs[titleIndex]}
                      </h3>
                      <p className="text-[#737373] text-left max-w-[400px] text-sm whitespace-pre-wrap">
                        {paragraphs[titleIndex + 1]}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button for admins */}
          {isAdmin && isEditing && (
            <button
              onClick={saveContent} // Save changes to API
              className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetterFuture;
