import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useUserContext} from "../../context/UserContext";
import {API_CONFIG} from "@config/api";

const LoginPage = () => {
  const {setUser} = useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const lockoutDuration = 30;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockout) {
      toast.error("Too many failed attempts. Please wait and try again.");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({isAdmin: data.user.isAdmin});
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
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{backgroundImage: "url(/AboutPage/Aboutbg.svg)"}}
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
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </div>
  );
};

export default LoginPage;
