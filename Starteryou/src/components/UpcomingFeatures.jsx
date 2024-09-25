import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./UpcomingFeatures.css";

const slides = [
  {
    img: "https://via.placeholder.com/800X600",
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
  },
  {
    img: "https://via.placeholder.com/800X600",
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
  },
  {
    img: "https://via.placeholder.com/800X600",
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
  },
];

const UpcomingFeatures = () => {
  return (
    <div
      className="w-full py-16"
      style={{
        background:
          "linear-gradient(106.35deg, rgba(205, 243, 246, 0.4) -1.21%, rgba(187, 174, 253, 0.4) 106.79%)",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12 ">
          Upcoming Features
        </h2>
        {/* Carousel */}
        <div className="w-full mx-auto max-w-[800px]">
          <Carousel
            className="custom-carousel" // Apply custom class here
            showArrows={false} // Disable arrows
            showThumbs={false} // Disable thumbnails
            infiniteLoop={true} // Infinite loop of slides
            autoPlay={true} // Auto slide
            interval={3000} // Slide every 3 seconds
            showStatus={false} // Remove status text
            emulateTouch={true}
            swipeable={true}
          >
            {slides.map((slide, index) => (
              <div key={index}>
                <img
                  src={slide.img}
                  className="object-cover mx-auto px-4 lg:px-0"
                  style={{ height: "400px", width: "100%" }}
                  alt={`Slide ${index + 1}`}
                />
                {/* Title and description */}
                <div className="text-center mt-4 px-4 min-h-[160px] md:min-h-[135px]">
                  <h3 className="text-2xl font-bold">{slide.title}</h3>
                  <p className="text-lg mt-2 text-[#767676]">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;
