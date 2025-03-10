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
        {/* <div className="mt-10 md:mt-20">
          <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
            Sign Up
          </button>
          <button className="text-black px-4 py-2 rounded-lg  items-center">
            Learn More
            <span className="ml-2">{">"}</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};
PathStart.metadata = {
  componentName: "PathStart",
  description:
    "A component that outlines the steps to a successful job search, encouraging users to sign up and explore opportunities.",
  features: {
    responsiveDesign: true, // Adjusts layout for different screen sizes
    stepGuidance: true, // Provides guidance through a series of steps for job seekers
    callToActionButtons: true, // Includes buttons for signing up and learning more
  },
  data: {
    steps: [
      {
        title: "Sign Up for a Seamless Experience",
        description:
          "Create your account and join our community of job seekers.",
      },
      {
        title: "Browse Listings Tailored for College Students",
        description:
          "Explore a variety of job listings that fit your skills and schedule.",
      },
      {
        title: "Apply with One Click for Convenience",
        description:
          "Submit your application effortlessly with a single click.",
      },
    ],
  },
  accessibility: {
    headings: "Clear headings for each step for better accessibility.",
    buttons: "Sign Up and Learn More buttons are easily accessible.",
  },
  styles: {
    container: {
      backgroundColor: "#FAF6FE", // Background color for the main container
      padding: "1.5rem", // Padding for the container
      maxWidth: "1300px", // Max width for larger screens
      margin: "0 auto", // Center alignment for the container
    },
    stepBox: {
      backgroundColor: "#FAF6FE", // Background color for each step box
      padding: "1.5rem", // Padding for step boxes
      maxWidth: "300px", // Max width for step boxes
      margin: "0 auto", // Center alignment for step boxes
    },
    button: {
      signUp: {
        backgroundColor: "#D9520E", // Background color for the Sign Up button
        color: "white", // Text color for the Sign Up button
        padding: "0.5rem 1rem", // Padding for the Sign Up button
        borderRadius: "0.375rem", // Rounded corners for the Sign Up button
      },
      learnMore: {
        backgroundColor: "transparent", // Background color for the Learn More button
        color: "black", // Text color for the Learn More button
        padding: "0.5rem 1rem", // Padding for the Learn More button
        borderRadius: "0.375rem", // Rounded corners for the Learn More button
      },
    },
  },
};
export default PathStart;
