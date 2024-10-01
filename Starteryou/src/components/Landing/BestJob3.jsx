const BestJob3 = () => {
    const box = {
      id: 0,
      iconSrc: "/LandingPage/Icons/pen.png",
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  
    return (
      <div className="container mx-auto max-w-[1200px] px-4 py-12 md:mb-10">
        <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
          {/* Left Section */}
          <div className="md:w-full lg:w-1/2 w-full md:text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold  mb-1 leading-tight">
              Lorem ipsum dolor sit amet consectetur adipiscing.
            </h2>
            <p className="text-gray-600 mb-2 md:text-lg font-light ">
              Let us handle the grunt work so you can do the fun stuff.
            </p>
            <a href="#" className="text-[#7950F2] hover:underline font-medium">
              Request for demo &gt;
            </a>
  
            {/*  Box */}
            <div className="mt-8 p-4 rounded-xl shadow-[0px_10.19px_30.57px_10.19px_#1F23290A] md:w-[600px] md:mx-auto lg:h-auto lg:mx-0 lg:max-w-[500px]">
              <div className="flex items-center space-x-4">
                <img src={box.iconSrc} alt={box.title} className="w-8 h-8" />
                <h3 className="text-xl font-bold text-[#7950F2]">{box.title}</h3>
              </div>
  
              <p className="mt-4 text-[#646A73] text-base font-light text-left">
                {box.description}
              </p>
            </div>
          </div>
  
          {/* Right Section */}
          <div className="w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
            <img
              src="/LandingPage/Rectangle.png"
              alt="Job Opportunities"
              className="relative w-[340px] h-[190px] top-[66px] left-[-48px] md:w-[480px] md:h-[200px] md:top-[71px] md:left-[-20px] lg:top-[78px] lg:left-[-70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{ transform: "rotate(-10.22deg)" }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default BestJob3;
  