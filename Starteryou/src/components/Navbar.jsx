import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-4 z-50 fixed bg-transparent text-white">
      {/* Company Title */}
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

      {/* Navigation Links (hidden on small screens, flex on medium and large screens) */}
      <ul className="hidden md:flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase z-10">
        <li className="cursor-pointer ">Home</li>
        <li className="cursor-pointer ">Education</li>
        <li className="cursor-pointer ">Jobs</li>
        <li className="cursor-pointer ">About Us</li>
        <li className="cursor-pointer ">Blog</li>
      </ul>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white text-[#2700D3] flex flex-col items-center space-y-6 py-8 z-50 md:hidden">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">Education</li>
          <li className="cursor-pointer">Jobs</li>
          <li className="cursor-pointer">About Us</li>
          <li className="cursor-pointer">Blog</li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
