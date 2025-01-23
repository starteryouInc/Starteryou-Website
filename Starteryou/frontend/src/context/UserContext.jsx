import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// A context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loginUser = (loginData) => {
    const { authenticatedUser, token } = loginData;
    setUser({ authenticatedUser, token });

    // Optionally store in localStorage/sessionStorage for persistence
    localStorage.setItem("token", token);
    localStorage.setItem("loginUser", JSON.stringify(loginUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser }}>
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
