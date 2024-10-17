import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useId } from "react";
import PropTypes from "prop-types";

const FileUpload = ({ handleFileChange }) => {
  const uniqueId = useId(); //  unique id for each instance

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <label htmlFor={`fileUpload-${uniqueId}`} className="cursor-pointer">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#6853E3] text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
          <FontAwesomeIcon icon={faUpload} size="lg" />
        </div>
      </label>
      <input
        id={`fileUpload-${uniqueId}`}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Choose file"
      />
    </div>
  );
};

//  prop types
FileUpload.propTypes = {
  handleFileChange: PropTypes.func.isRequired,
};

export default FileUpload;
