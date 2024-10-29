import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./UpcomingFeatures.css";
import { useNavigation } from "../../context/NavigationContext";

const imageTitles = ["uf1", "uf2", "uf3"]; // Titles for backend storage

const slidesData = [
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "", // Empty initially, will be fetched
  },
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "",
  },
  {
    title: "Get top Job analysis",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do",
    img: "",
  },
];

const UpcomingFeatures = () => {
  const [slides, setSlides] = useState(slidesData);
  const { isAdmin } = useNavigation();

  // Fetch images for each slide based on its title
  useEffect(() => {
    const fetchImages = async () => {
      const updatedSlides = await Promise.all(
        slides.map(async (slide, index) => {
          const title = imageTitles[index];
          try {
            const response = await fetch(`http://localhost:5001/api/files/title/${title}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            const imgURL = URL.createObjectURL(blob);
            return { ...slide, img: imgURL }; // Set the image URL for each slide
          } catch (error) {
            console.error(`Error fetching image for title ${title}:`, error);
            return slide;
          }
        })
      );
      setSlides(updatedSlides);
    };
    fetchImages();
  }, []);

  // Handle file change and update image by title
  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", imageTitles[index]); // Update based on title

    try {
      const response = await fetch("http://localhost:5001/api/files/update", {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Network response was not ok");

      // Update the image preview on successful upload
      const updatedSlides = slides.map((slide, i) =>
        i === index ? { ...slide, img: URL.createObjectURL(file) } : slide
      );
      setSlides(updatedSlides);
      console.log(`Image updated successfully for ${imageTitles[index]}`);
    } catch (error) {
      console.error("Error updating image:", error);
    }
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
                  src={slide.img || "https://via.placeholder.com/800X600"}
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
