import { faStar } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useState } from "react";
import TermsModal from "../Common/TermsModal";
import Privacy from "../Common/Privacy";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { API_CONFIG } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";

const EmployerSignUp = () => {

  const navigate = useNavigate();
  const { loginUser, user } = useUserContext();
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.userEmpRegister}`,
        {
          companyName,
          companyWebsite,
          email,
          password,
          role: "employer",
        }
      );
      loginUser({
        authenticatedUser: data.newEmployer,
        token: data.token.accessToken,
      });
      toast.success(data.msg);
      navigate("/createProfile");
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };


  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
      <div className="relative hidden w-full lg:w-2/5 bg-[#6A54DF] md:flex  flex-col text-white p-8 overflow-hidden">
        {/* Circle in the top-left */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Circle in the bottom-right */}
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="mt-20 ml-16 flex flex-col justify-center items-start">
          <h1 className="text-4xl lg:text-5xl font-bold">Welcome</h1>
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
          <h2 className="text-3xl font-bold mb-2">Join as Employer</h2>
          <p className="text-gray-600 mb-6">
            Starteryou simplifies the job application process for students.
          </p>

          {/* Input Fields */}
          <form onSubmit={handleRegister}>
            {/* Company Name */}
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border border-[#CBD5E1] shadow-sm"
                placeholder="Enter your company name"
                required
              />
            </div>
            {/* Company Website */}
            <div className="mb-4">
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                Company Website
              </label>
              <input
                type="url"
                id="website"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="mt-1 p-2 block w-full rounded-md border border-[#CBD5E1] shadow-sm"
                placeholder="Enter your company website URL"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
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

            {/* Password */}
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
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-indigo-600 border border-[#CBD5E1] rounded focus:ring-indigo-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the
                <button
                  type="button"
                  className="text-blue-600 hover:underline mx-1"
                  onClick={() => setShowTerms(true)}
                >
                  Terms & Conditions
                </button>
                and
                <button
                  type="button"
                  className="text-blue-600 hover:underline ml-1"
                  onClick={() => setShowPrivacy(true)}
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#6A54DF] text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Signup
            </button>

            {/* Redirect to Login */}
            <p className="pt-3 text-[#64748B]">
              Already have an account?{" "}
              <Link to="/UserLogin" className="text-[#6A54DF] font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
        {/* Modals */}
        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        <Privacy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </div>
    </div>
  );
};

export default EmployerSignUp;
