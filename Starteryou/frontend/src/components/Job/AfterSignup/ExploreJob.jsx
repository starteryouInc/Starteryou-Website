const ExploreJob = () => {
  const steps = [
    {
      title: "Your Future Starts Here: Find Jobs That Fit Your Skills",
      description:
        "Navigate through a variety of job listings designed for your career growth.",
      linkText: "Search",
      linkUrl: "#",
    },
    {
      title: "Discover Top Employers Looking for Talented College Students",
      description: "Connect with leading companies eager to hire fresh talent.",
      linkText: "View",
      linkUrl: "#",
    },
    {
      title: "Browse Job Categories to Find Your Ideal Position",
      description:
        "Explore various fields like IT, Healthcare, and Finance to match your interests.",
      linkText: "Explore",
      linkUrl: "#",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-[1300px] mx-auto p-6 text-center bg-white py-20">
        {/* Top Text */}
        <h3 className="text-3xl md:text-4xl font-bold text-black mt-2 max-w-[700px] mx-auto">
          Explore Job Opportunities Tailored for College Students and Recent
          Graduates
        </h3>

        {/* Boxes */}
        <div className="flex flex-col md:flex-row justify-center mt-10 md:mt-14 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6  w-full max-w-[400px] mx-auto"
            >
              <img
                src="/JobPortalPage/StarVector.svg"
                alt="step icon"
                className="w-7 h-7 mx-auto mb-4"
              />
              <h4 className="text-xl font-bold text-black pb-4">
                {step.title}
              </h4>
              <p className="text-black mt-2 text-sm mb-4">{step.description}</p>
              <a href={step.linkUrl} className=" font-medium px-1">
                {step.linkText} &gt;
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreJob;
