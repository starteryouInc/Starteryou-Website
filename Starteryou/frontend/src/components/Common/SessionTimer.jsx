import { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../../config/api';

const SessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastLogin, setLastLogin] = useState("0"); // Default to "0" if user is not logged in
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchSessionTime = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessionTime}`, { credentials: 'include' });
        if (!response.ok) throw new Error("Session expired");

        const data = await response.json();
        setTimeLeft(data.timeRemaining);
        setIsAuthenticated(data.isLoggedIn);

        if (data.isLoggedIn) {
          if (data.lastLogin) {
            setLastLogin(new Date(data.lastLogin).toLocaleString()); // Set last login timestamp
          } else {
            setLastLogin(new Date().toLocaleString()); // If no lastLogin in response, assume this is the login time
          }
        } else {
          setLastLogin("0"); // If not logged in, display "0"
        }

        if (data.timeRemaining <= 0) {
          setTimeLeft(0);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching session time:", error);
        setTimeLeft(0);
        setIsAuthenticated(false);
        setLastLogin("0"); // Ensure lastLogin is "0" on error
      }
    };

    fetchSessionTime();
    intervalRef.current = setInterval(fetchSessionTime, 60000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft !== null && prevTimeLeft > 0 ? prevTimeLeft - 1000 : prevTimeLeft));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const formatTime = (milliseconds) => {
    if (milliseconds === null) return "Loading...";
    if (milliseconds <= 0) {
      return isAuthenticated ? "Session timed out, Please log in again." : "Session timed out, Please log in.";
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-1 bg-gray-800 text-white shadow-md flex items-center justify-between w-full z-50">
      <p className="text-xs text-gray-400 ml-4">
        <strong>Last Login:</strong> {lastLogin}
      </p>
      <p className="text-xs text-gray-400 mr-4">
        <strong>Session Time:</strong> {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default SessionTimer;
