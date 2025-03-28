import { faStar } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useUserContext } from "../../context/UserContext";
import { API_CONFIG } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const UserLogin = () => {
  const { loginUser } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.userLogin}`,
        {
          email,
          password,
        },
        { withCredentials: true } // This ensures cookies are sent and received properly
      );
      loginUser({
        authenticatedUser: data.users,
        token: data.tokens.accessToken,
      });
      localStorage.setItem("lastLogin", Date.now().toString());
      toast.success(data.msg);
      if (data.users.role === "jobSeeker") {
        navigate("/jobfeeds");
      } else {
        navigate("/companyDashboard/");
      }
      // Fetch session time after login
      // await fetchSessionTime();
      // Dispatch custom event after successful login
      const event = new Event("userLoggedIn");
      window.dispatchEvent(event);
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  // const fetchSessionTime = async () => {
  //   try {
  //     const response = await fetch(
  //       `${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessionTime}`,
  //       { credentials: "include" }
  //     );
  //     if (!response.ok) throw new Error("Session expired");

  //     const data = await response.json();
  //     console.log("Session time fetched after login:", data);
  //   } catch (error) {
  //     console.error("Error fetching session time after login:", error);
  //   }
  // };

  const reviews = [
    {
      stars: 5,
      text: "Working with Starteryou has transformed our hiring process, connecting us with talented students eager to contribute. Their platform is a game-changer for companies looking to tap into fresh talent.",
      name: "Sarah Davis",
      position: "HR Manager",
      userImg: "/Reviewer/avatar-1.jpg.svg",
    },
    {
      stars: 4,
      text: "Starteryou helped us find the right talent quickly and efficiently. Their platform makes the recruitment process seamless and enjoyable.",
      name: "Jane Smith",
      position: "Talent Acquisition Lead",
      userImg: "/Reviewer/avatar-3.jpg",
    },
    {
      stars: 5,
      text: "This platform has been a vital tool for our hiring needs. The quality of talent we’ve encountered through Starteryou is unmatched.",
      name: "Emily Johnson",
      position: "Recruitment Specialist",
      userImg: "/Reviewer/avatar-2.jpg.svg",
    },
    {
      stars: 4,
      text: "Starteryou offers an intuitive platform that connects us to top-tier talent. It’s been an incredible asset to our team.",
      name: "Michael Brown",
      position: "Operations Manager",
      userImg: "/Reviewer/avatar-4.jpeg",
    },
  ];
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
      {/* Left Section */}
      <div className="relative hidden  w-full lg:w-2/5 bg-[#6A54DF] md:flex flex-col text-white p-8 overflow-hidden">
        {/* Circle in the top-left */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Circle in the bottom-right */}
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="mt-20 ml-16 flex flex-col justify-center items-start">
          <h1 className="text-4xl lg:text-5xl font-bold">Welcome Back!</h1>
          <p className="mt-4 text-lg max-w-[400px]">
            Starteryou simplifies the job application process for students.
          </p>
        </div>

        {/* Slider Box */}
        <div className="flex flex-col mt-24 ml-6 bg-[#6A54DF] p-4 md:p-6 justify-center">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            autoPlay
            interval={3000}
            stopOnHover
            className="text-left"
          >
            {reviews.map((review, index) => (
              <div key={index} className="p-4">
                {/* Stars */}
                <div className="flex space-x-1 text-yellow-400 mb-4">
                  {Array(review.stars)
                    .fill(0)
                    .map((_, idx) => (
                      <FontAwesomeIcon key={idx} icon={faStar} />
                    ))}
                </div>
                {/* Review Text */}
                <p className="text-white mb-4 text-left text-base font-light">
                  &quot;{review.text}&quot;
                </p>
                {/* Review Details */}
                <div className="flex items-center text-left">
                  <img
                    src={review.userImg} // Assuming review.userImg holds the image URL
                    alt={review.name}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      objectFit: "cover",
                    }} // Width is set to 3rem and height is equal for circular shape
                    className="rounded-full mr-4"
                  />
                  {/* Name and Position */}
                  <div>
                    <h3 className="text-white font-bold">{review.name}</h3>
                    <p className="text-white">{review.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/5 bg-white flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden relative">
        {/* Circle in the top-left */}
        <div className="md:hidden h-32 w-32 max-w-[8rem] max-h-[8rem] bg-transparent border-4 border-[#8574e4] rounded-full absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Circle in the bottom-right */}
        <div className="md:hidden h-32 w-32 bg-transparent border-4 border-[#8574e4] rounded-full absolute bottom-[39px] right-[13px] transform translate-x-1/2 translate-y-1/2"></div>

        <div className="w-full lg:w-3/4 max-w-md">
          <h2 className="text-3xl font-bold mb-2">Join Starteryou</h2>
          <p className="text-gray-600 mb-6">
            Starteryou simplifies the job application process for students.
          </p>

          {/* Input Fields */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border border-[#CBD5E1] shadow-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 block w-full rounded-md border border-[#CBD5E1] shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} /> // Eye-slash icon for hiding
                  ) : (
                    <AiFillEye size={20} /> // Eye icon for showing
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 border border-[#CBD5E1] rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/ForgotPswd"
                className="text-sm text-[#6A54DF] font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#6A54DF] text-white py-2  px-6 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Login
            </button>

            {/* Create Account */}
            <p className="pt-3 text-[#64748B]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-[#6A54DF] font-medium">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
