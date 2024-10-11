import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [canAccessProtectedRoute, setCanAccessProtectedRoute] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        canAccessProtectedRoute,
        setCanAccessProtectedRoute,
        isAdmin,
        setIsAdmin, // Adding this so you can update isAdmin from anywhere
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};

// New component to handle location updates
export const NavigationHandler = () => {
  const { setIsAdmin } = useNavigation(); // Access setIsAdmin from context
  const location = useLocation();

  useEffect(() => {
    // Update isAdmin based on the current pathname
    setIsAdmin(location.pathname.startsWith("/admin"));
  }, [location.pathname, setIsAdmin]);

  return null; // This component doesn't render anything
};
