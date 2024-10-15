const LaunchBanner = () => {
  return (
    <div className="flex flex-col md:flex-row  md:max-w-[1400px] md:mx-auto p-3 md:p-8 my-20">
      {/* Text Section */}
      <div className="flex flex-col justify-center md:w-1/2 p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Launch Your Career Journey
        </h1>
        <p className="text-gray-700 mb-4 ">
          Join our platform and discover exciting job opportunities tailored for
          college <br /> students like you!
        </p>
        <div className="flex space-x-4">
          <button className="bg-[#D9520E] text-white py-2 px-4 rounded-xl">
            Sign Up
          </button>
          <button className="bg-white border border-black text-black py-2 px-4 ">
            Learn More
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 p-4">
        <img
          src="/JobPortalPage/Placeholder Image.png"
          alt="Career Launch"
          className="w-full h-[370px] object-cover "
        />
      </div>
    </div>
  );
};

export default LaunchBanner;
