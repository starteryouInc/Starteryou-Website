import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// A context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// A custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};
