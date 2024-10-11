import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Correct import

const AdminProtectedRoute = ({ element }) => {
  const { user } = useContext(UserContext);

  // If the user is not an admin, redirect them to the regular home page
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the element (admin page)
  return element;
};

export default AdminProtectedRoute;
