import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";

const LoginPage = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const lockoutDuration = 30;

  const handleLogin = (e) => {
    e.preventDefault();

    if (lockout) {
      toast.error("Too many failed attempts. Please wait and try again.");
      return;
    }

    if (username === "admin" && password === "admin098") {
      setUser({ isAdmin: true });
      toast.success("Login successful!");
      setAttempts(0);
      setCountdown(0);

      navigate("/admin");
    } else {
      setAttempts((prev) => prev + 1);
      toast.error("Invalid username or password");

      if (attempts + 1 >= 3) {
        setLockout(true);
        setCountdown(lockoutDuration);
        toast.error("Too many failed attempts");

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setLockout(false);
              setAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
      <div className="bg-white p-8 mx-2 md:mx-0 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
        {lockout && countdown > 0 && (
          <p className="text-yellow-600 mb-4 text-center">
            Please Wait: {countdown}s
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={lockout}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
