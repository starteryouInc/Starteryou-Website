import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [canAccessProtectedRoute, setCanAccessProtectedRoute] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <NavigationContext.Provider
      value={{
        canAccessProtectedRoute,
        setCanAccessProtectedRoute,
        isAdmin,
        setIsAdmin, 
        isAuthenticated,
        setIsAuthenticated, 
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

// Component to handle location updates and manage isAdmin state
export const NavigationHandler = () => {
  const { setIsAdmin, setIsAuthenticated } = useNavigation(); 
  const location = useLocation();

  useEffect(() => {
    // Update isAdmin based on the current pathname
    setIsAdmin(location.pathname.startsWith("/admin"));

    // Simulate a check to see if the user is logged in (you'd replace this with actual authentication logic)
    const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn")); // Mock check using localStorage

    setIsAuthenticated(isLoggedIn); // Update the context with the authentication status
  }, [location.pathname, setIsAdmin, setIsAuthenticated]);

  return null; 
};
