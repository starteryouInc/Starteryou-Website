const ExcitingCareer = () => {
  const steps = [
    {
      title: "Discover Your Path in the Job Market with Our Categories",
      description:
        "Find the perfect job category that matches your skills and interests.",
      linkText: "Explore",
      linkUrl: "#",
    },
    {
      title:
        "IT Careers: Innovate, Create, and Lead in Technology-Driven Environments",
      description: "Join the dynamic world of IT and shape the future.",
      linkText: "View",
      linkUrl: "#",
    },
    {
      title: "Healthcare Jobs: Make a Difference in People's Lives Every Day",
      description:
        "Pursue a rewarding career in healthcare and help those in need.",
      linkText: "Discover",
      linkUrl: "#",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-[1300px] mx-auto p-6 text-center bg-white py-20">
        {/* Top Text */}
        <h3 className="text-3xl md:text-4xl font-bold text-black mt-2 max-w-[700px] mx-auto">
          Explore Exciting Career Opportunities Across Various Industries Just
          for You!
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

ExcitingCareer.metadata = {
  componentName: "ExcitingCareer",
  description:
    "A component that highlights various career opportunities across different industries, guiding users to explore specific job categories.",
  features: {
    careerExploration: true, // Allows users to explore various career paths
    responsiveDesign: true, // Adapts layout for different screen sizes
    linkNavigation: true, // Provides links for further exploration
  },
  steps: [
    {
      title: "Discover Your Path in the Job Market with Our Categories",
      description:
        "Find the perfect job category that matches your skills and interests.",
      linkText: "Explore",
      linkUrl: "#",
    },
    {
      title:
        "IT Careers: Innovate, Create, and Lead in Technology-Driven Environments",
      description: "Join the dynamic world of IT and shape the future.",
      linkText: "View",
      linkUrl: "#",
    },
    {
      title: "Healthcare Jobs: Make a Difference in People's Lives Every Day",
      description:
        "Pursue a rewarding career in healthcare and help those in need.",
      linkText: "Discover",
      linkUrl: "#",
    },
  ],
  accessibility: {
    linkText: "Link to explore the respective job category",
  },
  styles: {
    container: {
      backgroundColor: "white",
      padding: "2rem", // Padding for the container
    },
    title: {
      fontSize: "2rem", // Font size for the main title
      fontWeight: "bold",
      textAlign: "center", // Center-align the title
    },
    box: {
      backgroundColor: "white",
      padding: "1.5rem", // Padding for each box
      borderRadius: "0.5rem", // Rounded corners for boxes
    },
    link: {
      fontWeight: "medium",
      padding: "0.25rem 0", // Padding for the link
    },
  },
};
export default ExcitingCareer;
