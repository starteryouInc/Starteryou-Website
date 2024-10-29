import { useState } from "react";

const ComprehensiveFeatures = () => {
  const [EnrollSteps] = useState([
    {
      title: "Effortless Course Search and Enrollment Process for Students",
      description:
        "Find and enroll in courses that match your interests with ease.",
      linkText: "Learn More",
      linkUrl: "#",
    },
    {
      title: "Engaging Features to Enhance Your Learning Experience",
      description:
        "Join discussion forums and access instructor profiles to enrich your education.",
      linkText: "Join Now",
      linkUrl: "#",
    },
    {
      title: "Track Your Progress and Achieve Your Learning Goals",
      description:
        "Utilize our progress tracking tools to stay motivated and on track.",
      linkText: "Sign Up",
      linkUrl: "#",
    },
  ]);

  return (
    <div className="mx-auto max-w-[1430px] px-4 lg:px-10 py-20 ">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:pb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 md:mb-0 text-black md:text-left md:max-w-[320px] lg:max-w-[580px]">
          Explore Our Comprehensive Features for a Seamless Learning Experience
        </h1>
        <p className="mt-1 md:mt-0 text-black text-base  md:mr-2  md:max-w-[400px] lg:max-w-[550px]">
          Our platform offers a user-friendly interface that allows students to
          easily browse and enroll in courses from various schools. With
          detailed course listings and dedicated school profiles, students can
          make informed choices about their education. The personalized student
          dashboard keeps track of progress and grades, ensuring a tailored
          learning journey.
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
            <h4 className="text-xl md:text-2xl font-bold text-black max-w-[300px] md:max-w-[450px]">
              {steps.title}
            </h4>
            <p className="text-black mt-3 text-sm max-w-[350px] mb-4">
              {steps.description}
            </p>
            <a href={steps.linkUrl} className=" font-medium px-1">
              {steps.linkText} &gt;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensiveFeatures;
