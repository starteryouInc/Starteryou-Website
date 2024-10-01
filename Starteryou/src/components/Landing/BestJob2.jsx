import { useState } from "react";

const BestJob2 = () => {
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
      iconSrc: "/LandingPage/Icons/userr.svg",
      title: "Learn from the best",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Right Section (comes first on large screens) */}
        <div className="order-2 lg:order-1 w-[330px] h-[250px] md:w-[500px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          <img
            src="/LandingPage/Rectangle.png"
            alt="Job Opportunities"
            className="relative w-[340px] h-[180px] top-[35px] left-[30px] md:w-[550px] md:top-[28px] md:left-[50px] lg:top-[78px] lg:left-[70px] lg:w-[680px] lg:h-[400px] rounded-xl"
            style={{ transform: "rotate(-6.44deg)" }}
          />
        </div>

        {/* Left Section (comes first on small and medium screens) */}
        <div className="order-1 lg:order-2 md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            Request for demo &gt;
          </a>

          {/* Boxes (Arranged in a row for medium screens) */}
          <div className="mt-8 flex flex-col md:flex-row md:justify-between lg:flex-col md:space-x-2 space-y-4 md:space-y-0 md:px-10 lg:space-x-0 lg:px-0">
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
      </div>
    </div>
  );
};

export default BestJob2;
