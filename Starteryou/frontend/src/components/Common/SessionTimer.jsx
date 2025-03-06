import React, { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "../../config/api";
import SessionExpired from "./SessionExpired"; // Import the SessionExpired component

export function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false); // Track session expiration
  const intervalRef = useRef(null);

  // Fetch session time and update state when component is mounted or session changes
  const fetchSessionTime = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessionTime}`, { credentials: "include" });
      if (!response.ok) throw new Error("Session expired");

      const data = await response.json();
      setTimeLeft(data.timeRemaining);
      setIsAuthenticated(data.isLoggedIn);

      // If time remaining is 0, set sessionExpired state to true
      if (data.timeRemaining <= 0) {
        setTimeLeft(0);
        setSessionExpired(true); // Immediately mark the session as expired
      }
    } catch (error) {
      console.error("Error fetching session time:", error);
      setTimeLeft(0);
      setSessionExpired(true); // Mark the session as expired if there's an error
    }
  };

  useEffect(() => {
    fetchSessionTime(); // Call API once on component mount
  }, []);

  useEffect(() => {
    // Listen to authentication status change, if any (e.g., after login)
    const handleAuthChange = () => fetchSessionTime();
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('userLoggedIn', handleAuthChange); // Listen for custom event

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('userLoggedIn', handleAuthChange); // Clean up event listener
    };
  }, [isAuthenticated]);

  // Countdown logic to decrease timeLeft
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return; // Skip if timeLeft is already expired

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTime = prevTimeLeft - 1000;
        if (newTime <= 0) {
          setSessionExpired(true); // Mark session as expired
          clearInterval(intervalRef.current); // Stop the countdown once expired
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  const formatTime = (milliseconds) => {
    if (milliseconds === null) return "Loading...";
    if (milliseconds <= 0) {
      return isAuthenticated ? "Session timed out! Please log in again." : "Session timed out! Please log in.";
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <>
      {sessionExpired && <SessionExpired setSessionExpired={setSessionExpired} />} {/* Show the pop-up when session expires */}
      <span>{formatTime(timeLeft)}</span>
    </>
  );
}

export function Footer() {
  const [lastLogin, setLastLogin] = useState("0");

  useEffect(() => {
    const updateLoginTime = () => {
      const storedLoginTime = localStorage.getItem("lastLogin");
      if (storedLoginTime) {
        setLastLogin(new Date(parseInt(storedLoginTime)).toLocaleString());
      } else {
        setLastLogin("0"); // Set to "0" if no login time is found
      }
    };

    updateLoginTime();

    window.addEventListener("storage", updateLoginTime);
    window.addEventListener("userLoggedIn", updateLoginTime); // Listen for custom event

    return () => {
      window.removeEventListener("storage", updateLoginTime);
      window.removeEventListener("userLoggedIn", updateLoginTime); // Clean up event listener
    };
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