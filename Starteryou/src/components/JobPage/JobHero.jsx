export default function JobHero() {
  return (
    <div
      className="w-full h-[400px] sm:h-[600px] md:h-[700px] lg:h-[900px] bg-no-repeat bg-right lg:bg-center bg-cover flex justify-center lg:justify-start"
      style={{ backgroundImage: "url('/JobPage/JobHome.svg')" }}
    >
      {/* Spacer for the left side */}
      <div className="hidden md:flex md:flex-1"></div>

      {/* Content on the right side */}
      <div className="flex flex-col justify-center  lg:items-start p-4 md:max-w-[400px] lg:max-w-[500px] text-white space-y-4 md:space-y-6 lg:space-y-8 md:mr-20 lg:mr-28">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-center md:text-left">
          Launch Your Career with Starteryou!
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center md:text-left">
          Discover your ideal entry-level job that aligns with your skills and
          interests. At Starteryou, we connect you with opportunities that set
          you on the path to success.
        </p>
        <div className="flex space-x-4 justify-center  md:justify-start">
          <button className="px-6 py-2 bg-[#D9520E] border border-white text-white rounded-md">
            Start
          </button>
          <button className="px-6 py-2 bg-white text-[#D9520E] border border-[#D9520E] rounded-md">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
