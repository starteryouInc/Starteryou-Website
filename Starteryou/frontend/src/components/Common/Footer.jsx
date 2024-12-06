const Footer = () => {
  return (
    <footer className="relative bg-[#F8FAFC] p-6 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-28 py-20">
        {/* First Box */}
        <div className="space-y-4 md:col-span-1 max-w-[350px]">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-black uppercase">
              StarterYou
            </span>
          </div>
          <p className="text-md text-gray-600">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh
          </p>
          <div className="flex space-x-4">
            <div className="h-10 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center">
              <img src="/fb.svg" alt="Facebook" className="h-4 w-4" />
            </div>
            <div className="h-10 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center">
              <img src="/Twitter.svg" alt="Twitter" className="h-4 w-5" />
            </div>
            <div className="h-10 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center">
              <img src="/Insta.svg" alt="Instagram" className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Second Box */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-blue-600 uppercase">
            Company
          </h2>
          <ul className="space-y-3 text-gray-600 ">
            <li>
              <a href="/" className="hover:text-black ">
                About
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black ">
                Feature
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Works
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Career
              </a>
            </li>
          </ul>
        </div>

        {/* Third Box */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-blue-600 uppercase">
            Help
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="/" className="hover:text-black">
                Students Support
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Faculty Details
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Fourth Box */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-blue-600 uppercase">
            Resources
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="/" className="hover:text-black">
                Free eBooks
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Development Tutorial
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                How to - Blog
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                YouTube Playlist
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Separator */}
      <div className="border-t border-[#E2E8F0] w-[92%] mx-auto"></div>

      {/* Copyright Section */}
      <div className="text-center py-6 text-gray-500">
        © Copyright 2024, All Rights Reserved by Starteryou
      </div>
    </footer>
  );
};

export default Footer;
