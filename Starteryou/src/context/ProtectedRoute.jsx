import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUserContext } from "../context/UserContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated but not an admin, redirect them to the homepage
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and is an admin, render the element (admin page)
  return element;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
