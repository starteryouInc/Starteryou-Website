import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";

const LoginPage = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const lockoutDuration = 30;

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@starteryou\.com$/i;
    return regex.test(email);
    };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Email must end with @starteryou.com and be in the correct format.");
      return;
    }

    if (lockout) {
      toast.error("Too many failed attempts. Please wait and try again.");
      return;
    }

    try {
      // Sending the login request to the backend
      const response = await fetch("http://dev.starteryou.com:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setUser({ isAdmin: true, token: data.tokens.accessToken });
        toast.success("Login successful!");
        setAttempts(0);
        setCountdown(0);

        // Redirect user after login
        navigate("/admin");
      } else {
        // Failed login attempt
        setAttempts((prev) => prev + 1);
        toast.error(data.message || "Invalid credentials");

        if (attempts + 1 >= 3) {
          setLockout(true);
          setCountdown(lockoutDuration);
          toast.error("Too many failed attempts");

          // Lockout timer
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
    } catch (error) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/AboutPage/Aboutbg.svg)" }}
    >
      <div className="bg-white p-8 mx-4 md:mx-0 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>
        {lockout && countdown > 0 && (
          <p className="text-red-600 mb-4 text-center font-semibold">
            Please Wait: {countdown}s
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold disabled:bg-gray-400"
            disabled={lockout}
          >
            Login
          </button>
        </form>

        {/* Create account message */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/AdminSignup"
              className="text-blue-500 hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
