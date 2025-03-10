import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { useUserContext } from "../../context/UserContext";
import { FaRegUserCircle } from "react-icons/fa";

/**
 * Navbar component for the application.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isEduHero - Determines if the navbar is used in the education hero section.
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = ({ isEduHero }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAdmin } = useNavigation(); // Access isAdmin from context

  const { user, logoutUser } = useUserContext();
  const token = user?.token;
  const role = user?.authenticatedUser?.role || "";

  /**
   * Handles user logout and navigates to the homepage.
   */
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  /**
   * Handles scroll event to determine if the navbar should have a scrolled state.
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full flex items-center justify-between px-4 sm:px-8 md:px-2  lg:px-12 py-4 z-50 fixed transition-all duration-300 ${
        isEduHero
          ? "bg-[#8176FF] text-white"
          : isScrolled
          ? "bg-[#8176FF] text-white"
          : "bg-transparent text-white"
      }`}
    >
      <div className="flex items-center space-x-2">
        <img
          src="/prelogo.svg"
          alt="Logo"
          className="w-12 h-12 rounded-full object-cover"
        />
        <img
          src="/starteryou text white.svg"
          alt="Logo"
          className="w-[190px] h-[60px] mt-2 self-center object-cover"
        />
      </div>

      {/* Navigation Links for Medium and Large Screens */}
      <ul className="hidden md:flex  sm:space-x-4  lg:space-x-12 text-sm md:text-sm lg:text-xl font-bold uppercase z-10">
        <li>
          <Link to={isAdmin ? "/admin" : "/"} className="cursor-pointer">
            Home
          </Link>
        </li>
        <li>
          <Link
            to={isAdmin ? "/admin/education" : "/education"}
            className="cursor-pointer"
          >
            Education
          </Link>
        </li>
        <li>
          <Link
            to={isAdmin ? "/admin/jobs" : "/jobs"}
            className="cursor-pointer"
          >
            Jobs
          </Link>
        </li>
        <li>
          <Link
            to={isAdmin ? "/admin/about" : "/about"}
            className="cursor-pointer"
          >
            About Us
          </Link>
        </li>
      </ul>

      {/* Signup Button Links */}
      {!token ? (
        <div className="hidden md:flex items-center md:space-x-2 lg:space-x-6">
          <Link
            to="/signup"
            className="text-sm sm:text-base lg:text-xl font-bold  z-10 uppercase"
          >
            Sign up
          </Link>
          <button className="bg-[#D9502E] text-sm sm:text-base lg:text-xl text-[white] border-[2px] font-bold border-[#D9502E] px-3 py-1 lg:px-4 lg:py-2 rounded-lg uppercase">
            <Link to="/companyDashboard/postedJobs">Post Job</Link>
          </button>
        </div>
      ) : (
        <div className="after-login hidden md:flex items-center md:space-x-2 lg:space-x-6">
          {role === "" ? (
            <>
              {/* <h1 className="text-xl font-bold">Admin Panel</h1> */}
              <button
                onClick={handleLogout}
                className="text-sm sm:text-base lg:text-xl font-bold z-10 uppercase"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="text-sm sm:text-base lg:text-xl font-bold  z-10 uppercase"
              >
                Log Out
              </button>
              {role === "employer" ? (
                <button className="bg-[#D9502E] text-sm sm:text-base lg:text-xl text-[white] border-[2px] font-bold border-[#D9502E] px-3 py-1 lg:px-4 lg:py-2 rounded-lg uppercase">
                  <Link to="/companyDashboard/postedJobs">Post Job</Link>
                </button>
              ) : (
                <button>
                  <Link to="/userprofile">
                    <FaRegUserCircle className="text-4xl" />
                  </Link>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#F8F8FF] text-black transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } w-[90%] max-w-xs z-50 p-6 md:hidden`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 focus:outline-none"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Navigation Links for Mobile Screen */}
        <ul className="flex flex-col space-y-6 text-left text-base font-semibold uppercase mt-[5.5rem] opacity-[0.9]">
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/home.png"
              alt="Home"
              className="w-5 h-5"
            />
            <Link
              to={isAdmin ? "/admin" : "/"}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/education.png"
              alt="Education"
              className="w-5 h-5"
            />
            <Link
              to={isAdmin ? "/admin/education" : "/education"}
              onClick={() => setIsMenuOpen(false)}
            >
              Education
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/job.png"
              alt="Jobs"
              className="w-5 h-5"
            />
            <Link
              to={isAdmin ? "/admin/jobs" : "/jobs"}
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/about.png"
              alt="About Us"
              className="w-5 h-5"
            />
            <Link
              to={isAdmin ? "/admin/about" : "/about"}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
        </ul>
        {/* Signup Button Links */}
        <div className="flex items-center justify-center space-x-7 absolute bottom-[3.5rem]">
          <Link
            to="/signup"
            className="text-sm sm:text-base lg:text-xl font-bold z-10 uppercase  px-4 py-[11px] text-white bg-black text-center ml-2 "
          >
            Sign up
          </Link>
          <Link
            to="/EmpSignUp"
            className=" bg-white text-[#D9502E] border-[2px] font-bold border-[#D9502E] px-3 py-2  text-center"
          >
            List Job
          </Link>
        </div>
      </div>
    </nav>
  );
};
Navbar.metadata = {
  componentName: "Navbar",
  description:
    "A responsive navigation bar that adapts to user authentication state and scroll position. It includes links to different sections based on user role and provides options for logging in, signing up, and logging out.",
  features: {
    responsiveDesign: true,
    dynamicMenu: true,
    userRoleBasedLinks: true,
    mobileMenu: true,
  },
  accessibility: {
    ariaLabel: "Navigation menu",
    logoutButtonLabel: "Log Out",
    signupButtonLabel: "Sign up",
    postJobButtonLabel: "Post Job",
    userProfileIconLabel: "User Profile",
  },
  styles: {
    background: "Dynamic background based on scroll and user state",
    textColor: "White for eduHero and transparent backgrounds; black for scrolled state",
    animation: "Smooth transitions for mobile menu and scrolling effects",
  },
  children: {
    logo: {
      src: "/prelogo.svg",
      alt: "Logo",
    },
    mainLogo: {
      src: "/starteryou text white.svg",
      alt: "Logo Text",
    },
    menuLinks: [
      { name: "Home", path: "/", adminPath: "/admin" },
      { name: "Education", path: "/education", adminPath: "/admin/education" },
      { name: "Jobs", path: "/jobs", adminPath: "/admin/jobs" },
      { name: "About Us", path: "/about", adminPath: "/admin/about" },
    ],
  },
};

export default Navbar;
