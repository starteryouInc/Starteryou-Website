const PathStart = () => {
  const steps = [
    {
      title: "Sign Up for a Seamless Experience",
      description: "Create your account and join our community of job seekers.",
    },
    {
      title: "Browse Listings Tailored for College Students",
      description:
        "Explore a variety of job listings that fit your skills and schedule.",
    },
    {
      title: "Apply with One Click for Convenience",
      description: "Submit your application effortlessly with a single click.",
    },
  ];

  return (
    <div className="bg-[#FAF6FE]">
      <div className="max-w-[1300px] mx-auto p-6 text-center bg-[#FAF6FE] py-20">
        {/* Top Text */}
        <h2 className="text-md font-semibold text-black">Easy</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-black mt-2 max-w-[600px] mx-auto">
          Your Path to Job Opportunities Starts Here
        </h3>
        <p className="text-black mt-4 max-w-[650px] mx-auto">
          At Starteryou, we simplify your job search process. With just a few
          clicks, you can connect with potential employers and land your dream
          job.
        </p>

        {/* Boxes */}
        <div className="flex flex-col md:flex-row justify-center mt-10 md:mt-14 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#FAF6FE] p-6  w-full max-w-xs mx-auto"
            >
              <img
                src="/JobPortalPage/StarVector.svg"
                alt="step icon"
                className="w-7 h-7 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold text-black">{step.title}</h4>
              <p className="text-black mt-2 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 md:mt-20">
          <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
            Sign Up
          </button>
          <button className="text-black px-4 py-2 rounded-lg  items-center">
            Learn More
            <span className="ml-2">{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathStart;
