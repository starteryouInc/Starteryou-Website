import React from "react";
import { MdErrorOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

/**
 * Component that displays a session expired message and allows the user to navigate to the login page.
 *
 * @component
 * @example
 * <SessionExpired setSessionExpired={setSessionExpired} />
 *
 * @param {Object} props - The component props
 * @param {Function} props.setSessionExpired - Function to update the state and close the session expired popup
 * @returns {JSX.Element} The rendered SessionExpired component
 */
const SessionExpired = ({ setSessionExpired }) => { // Accept setSessionExpired function as prop
  const navigate = useNavigate(); // Initialize the navigate function

  /**
   * Handler for the login button click, navigates to the login page and closes the session expired popup.
   */
  const handleLoginClick = () => {
    navigate("/UserLogin"); // Navigate to the login page
    setSessionExpired(false); // Close the pop-up by updating the state
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          disabled // Close button does nothing
        >
          <IoClose size={24} />
        </button>
        <MdErrorOutline className="text-red-500 text-5xl mx-auto" />
        <h2 className="text-lg font-semibold mt-4">Session Expired</h2>
        <p className="text-sm text-gray-600 mt-2">
          Last session terminated, Please Login.
        </p>
        <button
          className="bg-[#7950F2] text-white px-6 py-2 rounded-md mt-6 w-full"
          onClick={handleLoginClick} // Trigger navigation to login page
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
