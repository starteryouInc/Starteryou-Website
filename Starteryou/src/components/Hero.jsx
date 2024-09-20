const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#2700D3] flex flex-col justify-center items-center text-center text-white px-4 overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute z-0"
        style={{
          width: "807px",
          height: "700px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#E5F1FF",
          filter: "blur(100px)",
          opacity: "0.8",
        }}
      ></div>

      {/* Main Background overlay */}
      <div className="absolute inset-0 top-0 w-full h-full bg-[radial-gradient(circle_farthest-side_at_50%_-150%,_rgba(229,241,255,1),_#2700D3),linear-gradient(to_bottom,_#2700D3,_rgba(229,241,255,1))] opacity-80 z-1"></div>

      {/* doodle1 */}
      <div className="absolute z-20 w-[80px] h-[80px] top-[140px] left-[0px] md:w-[212px] md:h-[157px] md:top-[150px] md:left-[8px] lg:left-[195px]">
        <img
          src="/LandingPage/4 1.png"
          alt="Doodle 1"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Main Heading */}
      <h1 className="font-bold text-[40px] sm:text-[64px] leading-tight text-black uppercase z-10 pt-[190px]">
        Collaborate Together
      </h1>

      {/* doodle2 */}
      <div className="absolute z-10 w-[100px] h-[100px] md:w-[150px] md:h-[150px] top-[236px] left-[280px] lg:w-[275px] lg:h-[242px] lg:top-[110px] md:top-[240px] md:left-[570px]  lg:left-[1180px] opacity-90">
        <img
          src="/LandingPage/hat.png"
          alt="Doodle 2"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Subheading */}
      <p className="font-normal text-[16px] sm:text-[28px] mt-6 max-w-5xl z-10">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
        nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 z-10">
        <button className="bg-white text-[#D9502E] font-bold px-8 py-4 rounded-md text-lg">
          Try for free
        </button>
        <button className="bg-[#D9502E] text-white font-bold px-8 py-4 rounded-md text-lg">
          Get Demo
        </button>
      </div>

      {/* doodle3 */}
      <div className="absolute z-10 hidden md:block lg:w-[241px] lg:h-[243px] lg:top-[400px] lg:left-[60px] md:w-[100px] md:h-[150px] md:top-[580px] md:left-[23px]">
        <img
          src="/LandingPage/doodle-4 1.png"
          alt="Doodle 3"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* doodle4 */}
      <div className="absolute z-10 w-[80px] h-[80px] top-[583px] left-[35px] md:w-[119px] md:h-[138px] lg:top-[420px] lg:left-[450px] md:top-[555px] md:left-[140px]">
        <img
          src="/LandingPage/obj2.png"
          alt="Doodle 4"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Image Section */}
      <div className="relative mt-20 flex justify-center items-center w-full">
        {/* Left Image */}
        <div className="absolute left-[22px] z-5 pt-20 w-[500px] h-[300px] md:w-[300px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
          <img
            src="/LandingPage/Heroimg3.png"
            alt="Left Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
        </div>

        {/* Central Image */}
        <div className="relative overflow-hidden z-10 w-full h-[300px] sm:w-[400px] md:w-[500px] md:h-[400px] lg:w-[900px] lg:h-[500px]">
          <img
            src="/LandingPage/Heroimg2.jpg"
            alt="Central Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
        </div>

        {/* doodle5 */}
        <div className="absolute w-[100px] h-[100px]  lg:w-[191px] lg:h-[192px] lg:top-[-60px] lg:left-[1080px] md:left-[566px] md:top-[-1px]">
          <img
            src="/LandingPage/doodle-7 1.png"
            alt="Doodle 5"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Right Image */}
        <div className="absolute right-[22px] z-5 pt-20 w-[500px] h-[300px] md:w-[300px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
          <img
            src="/LandingPage/Heroimg3.png"
            alt="Right Image"
            className="w-full h-full object-cover border-t-4 border-l-4 border-r-4 border-[#A9DCF7] rounded-t-2xl rounded-b-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
