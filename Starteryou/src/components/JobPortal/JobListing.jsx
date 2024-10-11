const JobListing = () => {
  const jobInfo = [
    {
      id: 1,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Find jobs that fit your schedule and skills.",
    },
    {
      id: 2,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Access opportunities from top employers in your area.",
    },
    {
      id: 3,
      imageSrc: "/JobPortalPage/Vector.svg",
      text: "Start your journey towards a successful career today!",
    },
  ];

  return (
    <div className=" mx-auto max-w-[1430px]  px-4 lg:px-10 py-20">
      <div className="flex flex-col md:flex-row md:items-center lg:items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-white p-6 flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-black">
            Discover Job Listings Curated Specifically for College Students
          </h2>
          <p className="text-black text-base max-w-[470px]">
            At Starteryou, we understand the unique needs of college students
            seeking job opportunities. Our platform offers a tailored selection
            of job listings designed to help you kickstart your career.
          </p>

          {/* Image and Text Columns */}
          <div className="mt-6 space-y-4">
            {jobInfo.map((info) => (
              <div key={info.id} className="flex items-center space-x-2">
                <img
                  src={info.imageSrc}
                  alt={`Icon ${info.id}`}
                  className="w-6 h-6"
                />
                <p className="text-black text-base">{info.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden flex justify-center md:items-center">
          <img
            src="/LandingPage/Rectangle.png"
            alt="Job Opportunities"
            className="relative w-[340px] h-[200px] md:w-[550px] md:h-[400px] lg:w-[680px] lg:h-[500px] rounded-xl left-[30px] top-[30px] md:left-[58px] md:top-[80px]"
            style={{ transform: "rotate(-6.44deg)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobListing;
