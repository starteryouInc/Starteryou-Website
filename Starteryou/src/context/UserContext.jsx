import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

// Create UserContext
export const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ isAdmin: false }); // Adjust this state as needed

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Define PropTypes for UserProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a required prop
};

// Hook for accessing UserContext
export const useUserContext = () => useContext(UserContext);
