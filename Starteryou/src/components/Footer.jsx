const Footer = () => {
  return (
    <footer className="relative bg-[#F0F4FF] p-6 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-28 py-20">
        {/* First Box */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-[#7950F2]">
              StarterYou
            </span>
          </div>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad dolor sit amet, consectetuer adipiscing
            elit, sed diam nonummy nibh euismod tincidunt.
          </p>
          <div className="flex space-x-4">
            {/*  social icons */}
            <div className="h-10 w-10 rounded-full bg-[#8C52FF] flex items-center justify-center">
              <img
                src="/LandingPage/Icons/fb.svg"
                alt="Facebook"
                className="h-4 w-4"
              />
            </div>
            <div className="h-10 w-10 rounded-full bg-[#8C52FF] flex items-center justify-center">
              <img
                src="/LandingPage/Icons/twitter.svg"
                alt="Twitter"
                className="h-4 w-5"
              />
            </div>
            <div className="h-10 w-10 rounded-full bg-[#8C52FF] flex items-center justify-center">
              <img
                src="/LandingPage/Icons/insta.svg"
                alt="Instagram"
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* Second Box */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7950F2]">
            Useful Links
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/features" className="hover:underline">
                Feature
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Third Box */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7950F2]">
            About Us
          </h2>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        {/* rectangular left img */}
        <img
          src="/LandingPage/footer-rect.png"
          alt="Layout"
          className="absolute hidden md:block w-[575px] h-[925px] lg:h-[848px]"
          style={{
            top: "-350px",
            left: "-83px",
            gap: "0px",
            opacity: "1",
            transform: "rotate(-13.32deg)",
          }}
        />
        <div className="hidden md:block absolute top-5 right-5 w-[30rem] h-[30rem] blur-[60px] z-0 rounded-full bg-[#3C77FF0A] overflow-auto opacity-[1]"></div>
      </div>
    </footer>
  );
};

export default Footer;
