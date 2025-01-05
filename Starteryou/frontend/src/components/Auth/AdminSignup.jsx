import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext"; 

const AdminSignup = () => {
  const { setUser } = useUserContext(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@starteryou\.com$/i;
    return regex.test(email);
    };

  const handleAdminSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Email must end with @starteryou.com and be in the correct format.");
      return;
    }

    try {
    const response = await fetch("${BACKEND_URL}/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        phoneNumber,
        username,
        role: "admin",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Admin signup successful! You can now log in.");
      setUser(data.user);
      navigate("/login");
    } else if (response.status === 409) {
      toast.error(data.message || "A user with this email already exists. Please log in.");
    } else {
      toast.error(data.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    toast.error("An error occurred during signup.");
  }
};

  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url(/AboutPage/Aboutbg.svg)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Sign Up</h2>
        <form onSubmit={handleAdminSignup} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
