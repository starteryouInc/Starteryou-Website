const Banner = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-4">
      {" "}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {" "}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            LOREM IPSUM DOLOR SIT AMET
          </h1>
          <p className="text-[#767676] mb-4 lg:max-w-[800px]">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet do Lorem ipsum dolor sit
            amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet do.
          </p>
          <button className="px-6 py-3 bg-[#D9502E] text-white rounded-md">
            Learn more
          </button>
        </div>
        {/*  Image */}
        <div className="md:flex-1 md:max-w-[35%] hidden md:block">
          {" "}
          {/* Reduced max width */}
          <img
            src="/LandingPage/Icons/Banner.png"
            alt="Placeholder"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
