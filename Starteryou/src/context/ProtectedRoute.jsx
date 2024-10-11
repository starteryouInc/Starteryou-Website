import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(UserContext);

  // If the user is not an admin, redirect them to the homepage
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the element (admin page)
  return element;
};

// Define PropTypes for ProtectedRoute
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // Validate that element is a required prop of type element
};

export default ProtectedRoute;
