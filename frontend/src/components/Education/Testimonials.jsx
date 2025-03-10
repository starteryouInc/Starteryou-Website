import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Testimonials = () => {
  const reviews = [
    {
      title:
        "Starteryou helped me land my first job right after college! The personalized recommendations made all the difference in my job search.",
      avatar: "/JobPortalPage/Placeholder Image.png",
      username: "Emily Johnson",
      occupation: "Marketing Intern, ABC Corp",
    },
    {
      title:
        "Thanks to Starteryou, I found the perfect role that aligns with my skills and passion. The job matching was spot-on, and the process was seamless.",
      avatar: "/JobPortalPage/Placeholder Image.png",
      username: "David Thompson",
      occupation: "Junior Software Developer, XYZ Solutions",
    },
    {
      title:
        "Starteryou gave me the confidence to switch careers and pursue my dream job. Their tailored advice and resources were exactly what I needed.",
      avatar: "/JobPortalPage/Placeholder Image.png",
      username: "Sarah Williams",
      occupation: "Project Manager, Global Tech Inc.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-white">
      {/* CSS for Carousel dots */}
      <style>
        {`
          .carousel .control-dots .dot {
            background-color: #ccc; /* Inactive dots color */
          }

          .carousel .control-dots .dot.selected {
            background-color: #000; /* Active dot color */
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto my-10 md:my-16">
        <Carousel
          showArrows={false}
          showThumbs={false}
          showStatus={false}
          selectedItem={currentIndex}
          onChange={(index) => setCurrentIndex(index)}
          autoPlay={false}
          infiniteLoop={true}
          emulateTouch={true}
          showIndicators={true}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-10 bg-white rounded-lg"
            >
              <h2 className="text-2xl font-semibold text-black mb-6">
                &quot;{review.title}&quot;
              </h2>
              <div className="flex items-center justify-center mb-2">
                <img
                  className="!w-14 !h-14 rounded-full object-cover"
                  src={review.avatar}
                  alt="profileImg"
                />
              </div>

              <p className="text-lg font-medium text-black">
                {review.username}
              </p>
              <p className="text-sm text-black mb-4">{review.occupation}</p>

              {/* Arrows in a Column */}
              <div className="flex flex-col items-center justify-center space-y-6 mt-6 md:mt-10 mb-3">
                <button
                  onClick={handlePrev}
                  className="bg-white text-black border border-black w-10 h-10 flex items-center justify-center rounded-full"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white text-black border border-black w-10 h-10 flex items-center justify-center rounded-full"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};
Testimonials.metadata = {
  componentName: "Testimonials",
  description:
    "A carousel component that displays user testimonials, highlighting their experiences with Starteryou. Users can navigate through testimonials using arrows.",
  features: {
    carouselFunctionality: true, // Allows users to cycle through testimonials
    responsiveDesign: true, // Adapts layout for different screen sizes
    customIndicators: true, // Customizes the appearance of carousel indicators
  },
  accessibility: {
    testimonials: [
      {
        title: "Starteryou helped me land my first job right after college!",
        username: "Emily Johnson",
        occupation: "Marketing Intern, ABC Corp",
      },
      {
        title: "Thanks to Starteryou, I found the perfect role that aligns with my skills and passion.",
        username: "David Thompson",
        occupation: "Junior Software Developer, XYZ Solutions",
      },
      {
        title: "Starteryou gave me the confidence to switch careers and pursue my dream job.",
        username: "Sarah Williams",
        occupation: "Project Manager, Global Tech Inc.",
      },
    ],
    buttons: {
      previous: "Previous testimonial",
      next: "Next testimonial",
    },
  },
  styles: {
    container: {
      backgroundColor: "white",
      maxWidth: "4xl",
      margin: "10px auto",
      padding: "2.5rem", // Padding around the carousel
    },
    testimonial: {
      title: {
        fontSize: "2rem",
        fontWeight: "semibold",
        color: "black",
      },
      username: {
        fontSize: "1.125rem", // Text-lg
        fontWeight: "medium",
        color: "black",
      },
      occupation: {
        fontSize: "0.875rem", // Text-sm
        color: "black",
      },
      avatar: {
        width: "3.5rem", // 14px
        height: "3.5rem", // 14px
      },
    },
    buttons: {
      default: {
        backgroundColor: "white",
        textColor: "black",
        borderColor: "black",
        width: "2.5rem", // 10px
        height: "2.5rem", // 10px
      },
    },
  },
};
export default Testimonials;
