import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state to track scroll
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle smooth scrolling to the blog section when the route changes
    if (location.hash === "#blog") {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Function to handle scrolling to blog section
  const handleBlogClick = () => {
    if (location.pathname === "/") {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#blog");
    }
  };

  // Scroll event listener to change color when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
       
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-4 z-50 fixed md:absolute transition-all duration-300 ${
        isScrolled ? "bg-[#F8F8FF] text-black" : "bg-transparent text-white"
      }`}
    >
      <div
        className={`text-xl lg:text-3xl font-bold uppercase transition-colors duration-300 ${
          isScrolled ? "text-black" : "text-white"
        }`}
      >
        StarterYou
      </div>

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

      {/* Navigation Links for Medium and Large Screens */}
      <ul className="hidden md:flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12 text-sm sm:text-base lg:text-xl font-bold uppercase z-10">
        <li>
          <Link to="/" className="cursor-pointer">
            Home
          </Link>
        </li>
        <li>
          <Link to="/education" className="cursor-pointer">
            Education
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="cursor-pointer">
            Jobs
          </Link>
        </li>
        <li>
          <Link to="/about" className="cursor-pointer">
            About Us
          </Link>
        </li>
        <li>
          <button
            onClick={handleBlogClick}
            className="cursor-pointer uppercase text-sm sm:text-base lg:text-xl font-bold"
          >
            Blog
          </button>
        </li>
      </ul>

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
          <li className="flex items-center space-x-3 ">
            <img
              src="/LandingPage/Icons/home.png"
              alt="Home"
              className="w-5 h-5 "
            />
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/education.png"
              alt="Education"
              className="w-5 h-5"
            />
            <Link to="/education" onClick={() => setIsMenuOpen(false)}>
              Education
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/job.png"
              alt="Jobs"
              className="w-5 h-5"
            />
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>
              Jobs
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/about.png"
              alt="About Us"
              className="w-5 h-5"
            />
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
          </li>
          <li className="flex items-center space-x-3">
            <img
              src="/LandingPage/Icons/blog.png"
              alt="Blog"
              className="w-5 h-5"
            />
            <button
              onClick={handleBlogClick}
              className="cursor-pointer uppercase"
            >
              Blog
            </button>
          </li>
        </ul>

        {/* Divider and Social Media Icons*/}
        <div className="absolute bottom-6 left-6 right-6">
          <hr className="border-0 h-[1px] bg-black rounded-sm mb-4" />

          {/* Social Media Icons */}
          <div className="flex justify-left space-x-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-8 h-8 rounded-full bg-[#7950F2] flex items-center justify-center">
                <img
                  src="/LandingPage/Icons/fb.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </div>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-8 h-8 rounded-full bg-[#7950F2] flex items-center justify-center">
                <img
                  src="/LandingPage/Icons/twitter.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </div>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-8 h-8 rounded-full bg-[#7950F2] flex items-center justify-center">
                <img
                  src="/LandingPage/Icons/insta.svg"
                  alt="Instagram"
                  className="w-5 h-5"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
