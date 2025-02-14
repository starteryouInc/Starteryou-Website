import { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../../config/api';

function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const intervalRef = useRef(null);  // Ref to store interval ID to clear later
  const lastApiCallTime = useRef(null); // Ref to track last API call to prevent continuous fetching

  useEffect(() => {
    // Fetch the session time only once when the component mounts
    const fetchSessionTime = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessionTime}`, { credentials: 'include' });
        if (!response.ok) throw new Error("Session expired");

        const data = await response.json();
        setTimeLeft(data.timeRemaining);
        setIsAuthenticated(data.isLoggedIn);

        // Set the remaining time on initial load if the session is valid
        if (data.timeRemaining <= 0) {
          setTimeLeft(0);
        }
      } catch (error) {
        console.error("Error fetching session time:", error);
        setTimeLeft(0);  // Set time to 0 in case of an error (e.g., session expired)
      }
    };

    if (!lastApiCallTime.current || Date.now() - lastApiCallTime.current > 60000) {  // Prevent API calls if made in the last 60 seconds
      fetchSessionTime();
      lastApiCallTime.current = Date.now();  // Update the time of last API call
    }

    // Start the interval to update the remaining time every second
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        // If timeLeft is not null, decrement it every second
        if (prevTimeLeft !== null && prevTimeLeft > 0) {
          return prevTimeLeft - 1000;  // Decrease by 1 second (1000 ms)
        }
        return prevTimeLeft; // Stop decrementing if the time is up
      });
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup the interval on component unmount
  }, []);

  const formatTime = (milliseconds) => {
    if (milliseconds === null) return "Loading...";
    if (milliseconds <= 0) {
      return isAuthenticated ? "Session timed out! Please log in again." : "Session timed out.";
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <div>
      <h3>Session Timer</h3>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
}

export default SessionTimer;
