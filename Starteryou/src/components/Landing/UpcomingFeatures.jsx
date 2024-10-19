import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./UpcomingFeatures.css";
import { useNavigation } from "../../context/NavigationContext";

const slidesData = [
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
  const [slides, setSlides] = useState(slidesData);
  const { isAdmin } = useNavigation();
  // Handle file change and update the image for the correct slide
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newImageUrl = URL.createObjectURL(file);

    // Update the image for the specific slide
    const updatedSlides = slides.map((slide, i) =>
      i === index ? { ...slide, img: newImageUrl } : slide
    );
    setSlides(updatedSlides);
  };

  return (
    <div
      className="w-full py-16"
      style={{
        background:
          "linear-gradient(106.35deg, rgba(205, 243, 246, 0.4) -1.21%, rgba(187, 174, 253, 0.4) 106.79%)",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12">
          Upcoming Features
        </h2>
        {/* Carousel */}
        <div className="w-full mx-auto max-w-[800px]">
          <Carousel
            className="custom-carousel"
            showArrows={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            showStatus={false}
            emulateTouch={true}
            swipeable={true}
          >
            {slides.map((slide, index) => (
              <div key={index} className="relative">
                {/* Slide Image */}
                <img
                  src={slide.img}
                  className="object-cover mx-auto px-4 lg:px-0"
                  style={{ height: "400px", width: "100%" }}
                  alt={`Slide ${index + 1}`}
                />

                {/* Admin Upload Button */}
                {isAdmin && (
                  <div className="absolute top-4 right-4">
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                        <FontAwesomeIcon icon={faUpload} size="lg" />
                      </div>
                    </label>
                    <input
                      id={`file-upload-${index}`} // Unique ID for each slide
                      type="file"
                      onChange={(e) => handleFileChange(e, index)}
                      className="hidden"
                      aria-label="Upload Image"
                    />
                  </div>
                )}

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
