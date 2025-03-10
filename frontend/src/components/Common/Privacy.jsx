import { useState } from "react";
import { IoClose } from "react-icons/io5"; // Import close icon
import { ImSpinner8 } from "react-icons/im"; // Import spinner icon
import PropTypes from "prop-types"; // Import PropTypes
const Privacy = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true); // Track PDF loading
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-3xl w-full h-[80vh] flex flex-col relative border border-gray-200">
        {/* Header (Top-Left) */}
        <h2 className="text-xl font-semibold text-gray-800 absolute top-4 left-6">
          Privacy Policy
        </h2>

        {/* Close Icon (Top-Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200"
        >
          <IoClose size={28} />
        </button>

        {/* Loader (Show until PDF is loaded) */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <ImSpinner8 className="text-blue-600 animate-spin" size={40} />
          </div>
        )}

        {/* PDF Viewer - No toolbar */}
        <iframe
          src="/STARTERYOU PRIVACY POLICY.pdf#toolbar=0"
          className="w-full flex-1 mt-10 border rounded-lg shadow-inner"
          onLoad={() => setLoading(false)} // Hide loader when loaded
          style={{ display: loading ? "none" : "block" }} // Hide iframe until loaded
        ></iframe>
      </div>
    </div>
  );
};
// ✅ Add PropTypes validation
Privacy.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean
  onClose: PropTypes.func.isRequired, // onClose should be a function
};

Privacy.metadata = {
  componentName: "Privacy",
  description:
    "A modal component that displays the privacy policy as a PDF. It includes a close button, a loading spinner while the PDF is loading, and handles visibility based on the `isOpen` prop.",
  features: {
    modalDisplay: true,
    pdfLoadingIndicator: true,
    closeButton: true,
  },
  accessibility: {
    modalAriaLabel: "Privacy Policy Modal",
    closeButtonLabel: "Close Privacy Policy",
  },
  styles: {
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modal: {
      backgroundColor: "white",
      border: "1px solid gray",
      borderRadius: "12px",
      boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textColor: "gray-800",
    },
    closeButton: {
      hoverColor: "red-600",
    },
    loader: {
      color: "blue-600",
    },
    iframe: {
      border: "none",
    },
  },
  apiIntegration: {
    pdfSource: "/STARTERYOU PRIVACY POLICY.pdf",
  },
  children: {
    header: "Privacy Policy",
  },
};
export default Privacy;
