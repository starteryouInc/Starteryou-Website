const Footer = () => {
  return (
    <footer className="relative bg-[#F8FAFC] p-6 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-28 py-20">
        {/* First Box */}
        <div className="space-y-4 md:col-span-1 max-w-[370px]">
          <div className="flex items-center space-x-2">
            <img
              src="/Logo.svg"
              alt="Logo"
              className="w-[230px] h-[65px] rounded-full object-cover ml-[-10px] mt-[-13px]"
            />
            {/* <span className="text-2xl font-bold text-black uppercase ">
              StarterYou
            </span> */}
          </div>
          <p className="text-md text-gray-600">
            Find your path, Build your future
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/people/Starter-You/pfbid0cKcKnJD21XgSFq7hohEhxuXbbeyZk1u8uvtktPesNbpdaXFKVuqXaKJwXekshggJl/"
              target="_blank"
              title="Facebook"
              rel="noopener noreferrer"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img src="/fb.svg" alt="Facebook" className="h-3 w-3" />
            </a>

            <a
              href="https://x.com/starter_you"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img src="/Twitter.svg" alt="Twitter" className="h-3 w-3" />
            </a>

            <a
              href="https://www.instagram.com/starteryou_official/"
              target="_blank"
              title="Instagram"
              rel="noopener noreferrer"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img src="/Insta.svg" alt="Instagram" className="h-3 w-3" />
            </a>
            <a
              href="https://www.linkedin.com/company/starteryou/"
              target="_blank"
              rel="noopener noreferrer"
              title="Linkedin"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img
                src="/devicon_linkedin.svg"
                alt="Linkedin"
                className="h-3 w-3"
              />
            </a>
            <a
              href="https://www.youtube.com/@Starteryou"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img src="/utube.svg" alt="Youtube" className="h-3 w-3" />
            </a>
            <a
              href="https://www.tiktok.com/@starteryou_official"
              target="_blank"
              rel="noopener noreferrer"
              title="Tiktok"
              className="h-7 w-10 rounded-full bg-white border border-[#D4D4D8] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img src="/tiktok.svg" alt="Tiktok" className="h-4 w-4" />
            </a>
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
                About us
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black ">
                My Profile
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Explore Jobs
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                List a Job
              </a>
            </li>
          </ul>
        </div>

        {/* Third Box */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-blue-600 uppercase">
            Resources
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="/" className="hover:text-black">
                Newsletter
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                Blogs/Articles
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-black">
                YouTube Playlist
              </a>
            </li>
          </ul>
        </div>

        {/* Fourth Box */}
        <div>
          <h2 className="text-md font-semibold mb-4 text-blue-600 uppercase">
            Help
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <a href="/" className="hover:text-black">
                Contact Us
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
      </div>
      {/* Separator */}
      <div className="border-t border-[#E2E8F0] w-[92%] mx-auto"></div>

      {/* Copyright Section */}
      <div className="text-center py-6 text-gray-500">
        © Copyright 2025, All Rights Reserved by Starteryou, Inc.
      </div>
    </footer>
  );
};

export default Footer;
