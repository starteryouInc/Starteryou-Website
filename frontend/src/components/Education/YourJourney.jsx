import { useState } from "react";

const YourJourney = () => {
  const [EnrollSteps] = useState([
    {
      title: "Step 1: Browse Available Courses",
      description:
        "Explore a comprehensive list of courses offered by different schools.",
    },
    {
      title: "Step 2: Select Your Desired Course",
      description: "Choose a course that aligns with your goals.",
    },
    {
      title: "Step 3: Complete the Enrollment Process",
      description: "Follow simple steps to enroll and make payment.",
    },
  ]);

  return (
    <div className="mx-auto max-w-[1430px] px-4 lg:px-10 py-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:pb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 md:mb-0 text-black md:text-left md:max-w-[320px] lg:max-w-[500px]">
          <span className="text-xl font-medium ">Enroll</span> <br /> Your
          Journey to Learning Starts Here
        </h1>
        <p className="mt-1 md:mt-0 text-black text-base  md:mr-2  md:max-w-[400px] lg:max-w-[550px]">
          Discover a wide range of courses tailored to your interests. Our
          platform makes it easy to browse, select, and enroll in courses from
          various schools. Join a community of learners and take the next step
          in your education.!
        </p>
      </div>

      {/* Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:mt-10">
        {EnrollSteps.map((steps, index) => (
          <div key={index} className="relative mb-4 md:mb-0">
            <img
              src="/JobPortalPage/StarVector.svg"
              alt="step icon"
              className="w-7 h-7  mb-4"
            />
            <h4 className="text-xl md:text-2xl font-bold text-black max-w-[300px] md:max-w-[350px]">
              {steps.title}
            </h4>
            <p className="text-black mt-3 text-sm max-w-[350px]">
              {steps.description}
            </p>
          </div>
        ))}
      </div>
      {/* Buttons */}
      <div className="mt-10 md:mt-20">
        <button className="bg-white text-black border border-black py-2 px-4  mr-4">
          Learn
        </button>
        <button className="text-black px-4 py-2 rounded-lg  items-center">
          Start
          <span className="ml-2">{">"}</span>
        </button>
      </div>
    </div>
  );
};

YourJourney.metadata = {
  componentName: "YourJourney",
  description:
    "A component that outlines the enrollment steps for courses, guiding users through the process of selecting and enrolling in educational opportunities.",
  features: {
    courseEnrollmentSteps: true, // Displays the steps for course enrollment
    responsiveDesign: true, // Adapts layout for different screen sizes
    buttons: true, // Includes buttons for further actions
  },
  steps: [
    {
      title: "Step 1: Browse Available Courses",
      description:
        "Explore a comprehensive list of courses offered by different schools.",
    },
    {
      title: "Step 2: Select Your Desired Course",
      description: "Choose a course that aligns with your goals.",
    },
    {
      title: "Step 3: Complete the Enrollment Process",
      description: "Follow simple steps to enroll and make payment.",
    },
  ],
  accessibility: {
    buttons: {
      learn: "Learn more about the available courses",
      start: "Start the enrollment process",
    },
  },
  styles: {
    container: {
      maxWidth: "1430px",
      padding: "2rem", // Padding for the outer container
    },
    title: {
      fontSize: "2rem", // Base title font size
      fontWeight: "bold",
      color: "black",
    },
    steps: {
      title: {
        fontSize: "1.5rem", // Font size for step titles
        fontWeight: "bold",
        color: "black",
      },
      description: {
        color: "black",
        fontSize: "0.875rem", // Base text size for step descriptions
      },
      icon: {
        width: "1.75rem", // Width of the step icons
        height: "1.75rem", // Height of the step icons
      },
    },
    buttons: {
      default: {
        backgroundColor: "white",
        textColor: "black",
        borderColor: "black",
        padding: "0.5rem 1rem",
      },
      start: {
        color: "black",
        padding: "0.5rem 1rem",
      },
    },
  },
};
export default YourJourney;
