import { useState } from "react";

const BestJob = () => {
  const [activeBox, setActiveBox] = useState(0);

  const boxes = [
    {
      id: 0,
      iconSrc: "/LandingPage/Icons/page 1.svg",
      title: "Lorem Ipsum",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 1,
      iconSrc: "/LandingPage/Icons/FindJob.svg",
      title: "Find Jobs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 2,
      iconSrc: "/LandingPage/Icons/addJob.svg",
      title: "Add Jobs",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section */}
        <div className="md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Find the best jobs that define you.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            See new openings &gt;
          </a>

          {/* Boxes (Arranged in a row for medium screens) */}
          <div className="mt-8 flex flex-col md:flex-row md:justify-between lg:flex-col md:space-x-2 space-y-4 md:space-y-0 md:px-6 lg:space-x-0 lg:px-0">
            {boxes.map((box) => (
              <div
                key={box.id}
                className={`p-4 rounded-xl cursor-pointer ${
                  activeBox === box.id
                    ? "shadow-[0px_10.19px_30.57px_10.19px_#1F23290A]"
                    : "shadow-none"
                } md:w-[300px] md:h-[200px] lg:h-auto lg:w-auto`}
                onClick={() => setActiveBox(box.id)}
              >
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <img
                    src={box.iconSrc}
                    alt={box.title}
                    className="w-8 h-8"
                    style={{
                      filter:
                        activeBox === box.id
                          ? "invert(29%) sepia(65%) saturate(7461%) hue-rotate(248deg) brightness(88%) contrast(97%)"
                          : "none",
                    }}
                  />
                  {/* Title */}
                  <h3
                    className={`text-xl font-bold ${
                      activeBox === box.id ? "text-[#7950F2]" : "text-black"
                    }`}
                  >
                    {box.title}
                  </h3>
                </div>

                {activeBox === box.id && (
                  <p className="mt-4 text-gray-600 text-lg font-thin text-left">
                    {box.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (Centered for medium screens) */}
        <div className="w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl  ">
          <img
            src="/LandingPage/Rectangle.png"
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[25px] left-[30px] md:w-[320px] md:left-[50px] lg:top-[47px] lg:left-[70px] lg:w-[440px] lg:h-[300px] rounded-xl "
          />
          <img
            src="/LandingPage/Heroimg2.jpg"
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[-68px] left-[80px] md:left-[180px] md:w-[320px] lg:top-[-112px] lg:left-[190px] lg:w-[420px] lg:h-[300px] rounded-xl z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default BestJob;
