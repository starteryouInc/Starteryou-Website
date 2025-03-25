import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

/**
 * Creates a React context for managing user authentication state.
 */
const UserContext = createContext();

/**
 * Provides user authentication state and actions to children components.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} The UserProvider component.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loginUser");
    const savedToken = localStorage.getItem("token");
    return savedUser && savedToken ? { authenticatedUser: JSON.parse(savedUser), token: savedToken } : null;
  });
  /**
   * Logs in the user by storing authentication data.
   *
   * @param {Object} loginData - The login data containing user details.
   * @param {Object} loginData.authenticatedUser - The authenticated user object.
   * @param {string} loginData.token - The authentication token.
   */
  const loginUser = (loginData) => {
    const { authenticatedUser, token } = loginData;
    setUser({ authenticatedUser, token });

    // Optionally store in localStorage/sessionStorage for persistence
    localStorage.setItem("token", token);
    localStorage.setItem("loginUser", JSON.stringify(authenticatedUser));
  };

  /**
   * Logs out the user by clearing authentication data.
   */
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loginUser");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the UserContext.
 *
 * @returns {Object} The user context containing authentication state and actions.
 */
export const useUserContext = () => {
  return useContext(UserContext);
};
