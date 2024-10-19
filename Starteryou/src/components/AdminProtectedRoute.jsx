import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUserContext } from "../context/UserContext";

const AdminProtectedRoute = ({ element }) => {
  const { user } = useUserContext();

  return user && user.isAdmin ? element : <Navigate to="/login" />; // Check if user exists and is admin
};

// PropTypes validation
AdminProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default AdminProtectedRoute;
