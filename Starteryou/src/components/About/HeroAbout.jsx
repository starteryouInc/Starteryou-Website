const HeroAbout = () => {
  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/AboutPage/Aboutbg.svg)" }}
    >
      <div className="relative z-10 flex justify-center items-center h-full">
        {/* Container */}
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 lg:space-x-12 max-w-6xl p-6 lg:p-12 space-y-6 md:space-y-0">
          {/* Image Container */}
          <div className="w-full md:w-1/2 hidden md:flex justify-center mb-6 md:mb-[-25px] lg:mb-[-144px]">
            <img
              src="/AboutPage/aboutMen.svg"
              alt="About Image"
              className="w-full h-[400px] md:h-[450px] lg:h-[550px] object-cover"
            />
          </div>

          {/* Text and Buttons Container */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 pt-24 md:pt-0">
            <h1 className="text-3xl lg:text-5xl font-semibold text-white">
              xxxxxxxxxxxxxxxxxxx <br /> xxxxxxx
            </h1>
            <p className="text-lg lg:text-xl text-gray-300">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <br /> xxxxxxxxxxxxxxxxxxx
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <button className="bg-[#D9502E] text-white py-2 px-6 rounded-lg font-semibold">
                Get Demo
              </button>
              <button className="bg-white text-[#D9502E] py-2 px-6 rounded-lg font-semibold">
                Try for Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAbout;
