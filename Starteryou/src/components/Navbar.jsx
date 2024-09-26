import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#blog") {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

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

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-4 z-50 fixed bg-transparent text-white">
      <div className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold uppercase">
        StarterYou
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
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

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase z-10">
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
        {/* Blog Link */}
        <li>
          <button onClick={handleBlogClick} className="cursor-pointer">
            Blog
          </button>
        </li>
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white text-[#2700D3] flex flex-col items-center space-y-6 py-8 z-50 md:hidden text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
          <li>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/education" onClick={() => setIsMenuOpen(false)}>
              Education
            </Link>
          </li>
          <li>
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
          </li>
          <li>
            <button onClick={handleBlogClick} className="cursor-pointer">
              Blog
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
