import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "../../config/api";

export function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const intervalRef = useRef(null);
  const lastApiCallTime = useRef(null);

  useEffect(() => {
    const fetchSessionTime = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessionTime}`, { credentials: "include" });
        if (!response.ok) throw new Error("Session expired");

        const data = await response.json();
        setTimeLeft(data.timeRemaining);
        setIsAuthenticated(data.isLoggedIn);

        if (data.timeRemaining <= 0) {
          setTimeLeft(0);
        }
      } catch (error) {
        console.error("Error fetching session time:", error);
        setTimeLeft(0);
      }
    };

    if (!lastApiCallTime.current || Date.now() - lastApiCallTime.current > 60000) {
      fetchSessionTime();
      lastApiCallTime.current = Date.now();
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft !== null && prevTimeLeft > 0 ? prevTimeLeft - 1000 : prevTimeLeft));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (milliseconds) => {
    if (milliseconds === null) return "Loading...";
    if (milliseconds <= 0) {
      return isAuthenticated ? "Session timed out! Please log in again." : "Session timed out! Please log in.";
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  return <span>{formatTime(timeLeft)}</span>;
}

export function Footer() {
  const [lastLogin, setLastLogin] = useState(null);

  useEffect(() => {
    // Retrieve the last login time from localStorage
    const storedLoginTime = localStorage.getItem("lastLogin");
    if (storedLoginTime) {
      setLastLogin(new Date(parseInt(storedLoginTime)).toLocaleString());
    } else {
      setLastLogin("0");
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-1 bg-gray-800 text-white shadow-md flex items-center justify-between w-full z-50">
      <p className="text-xs text-gray-400 ml-4">
        <strong>Last Login:</strong> {lastLogin}
      </p>
      <p className="text-xs text-gray-400 mr-4">
        <strong>Session Time:</strong> <SessionTimer />
      </p>
    </div>
  );
}

export default Footer;
