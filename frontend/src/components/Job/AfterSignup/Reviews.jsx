import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Reviews = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const reviews = [
    {
      stars: 5,
      text: "Working with Starteryou has transformed our hiring process, connecting us with talented students eager to contribute. Their platform is a game-changer for companies looking to tap into fresh talent.",
      name: "John Doe",
      position: "HR Manager",
      company: "Pinterest",
    },
    {
      stars: 4,
      text: "Starteryou helped us find the right talent quickly and efficiently. Their platform makes the recruitment process seamless and enjoyable.",
      name: "Jane Smith",
      position: "Talent Acquisition Lead",
      company: "Pinterest",
    },
    {
      stars: 5,
      text: "This platform has been a vital tool for our hiring needs. The quality of talent we’ve encountered through Starteryou is unmatched.",
      name: "Emily Johnson",
      position: "Recruitment Specialist",
      company: "Pinterest",
    },
    {
      stars: 4,
      text: "Starteryou offers an intuitive platform that connects us to top-tier talent. It’s been an incredible asset to our team.",
      name: "Michael Brown",
      position: "Operations Manager",
      company: "Pinterest",
    },
  ];

  return (
    <div className="max-w-[1300px] mx-auto text-center p-6 pt-24 md:pb-12">
      {/* Box Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 py-5 md:py-10">
        {/* Video Box */}
        <div className="relative w-full h-auto">
          <div className="relative overflow-hidden rounded-sm shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-[300px] md:h-[400px] object-cover"
              controls={false}
            >
              <source
                src="/AboutPage/8471681-sd_640_338_25fps.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 hover:bg-opacity-50 transition-all duration-300"
            >
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="text-white text-2xl"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Slider Box */}
        <div className="flex flex-col bg-white p-4 md:p-6 justify-center ">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            autoPlay
            interval={3000}
            stopOnHover
            className="text-left"
          >
            {reviews.map((review, index) => (
              <div key={index} className="p-4">
                {/* Stars */}
                <div className="flex space-x-1 text-yellow-400 mb-4">
                  {Array(review.stars)
                    .fill(0)
                    .map((_, idx) => (
                      <FontAwesomeIcon key={idx} icon={faStar} />
                    ))}
                </div>
                {/* Review Text */}
                <p className="text-gray-900 font-semibold  mb-4 text-left text-lg">
                  {review.text}
                </p>
                {/* Review Details */}
                <div className="flex items-center text-left">
                  {/* Name and Position */}
                  <div>
                    <h3 className="text-gray-900 font-bold">{review.name}</h3>
                    <p className="text-gray-600">{review.position}</p>
                  </div>
                  {/* Vertical Separator */}
                  <div className="w-[1px] bg-gray-900 h-10 mx-4"></div>
                  {/* Company Name */}
                  <div>
                    <p className="text-gray-900 font-medium">
                      {review.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

Reviews.metadata = {
  componentName: "Reviews",
  description:
    "A component that showcases user testimonials through a video player and a carousel of reviews, enhancing user engagement and credibility.",
  features: {
    videoPlayback: true, // Allows users to play or pause a video
    reviewsCarousel: true, // Displays user reviews in a carousel format
    starRating: true, // Renders star ratings for each review
  },
  userInteractions: {
    playPauseButton: {
      description: "Toggle video playback.",
      accessibilityLabel: "Play or pause the video.",
    },
    reviewCarousel: {
      description: "Automatically cycles through reviews every 3 seconds.",
      stopOnHover: true, // Stops carousel autoplay on hover
    },
  },
  styles: {
    container: {
      maxWidth: "1300px", // Maximum width for the container
      margin: "0 auto", // Center alignment
      padding: "24px 16px", // Padding for the component
    },
    videoContainer: {
      position: "relative", // Position for absolute elements
      overflow: "hidden", // Hide overflow for rounded corners
      borderRadius: "0.25rem", // Rounded corners
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
    },
    reviewText: {
      color: "gray-900", // Color for review text
      fontWeight: "600", // Bold font weight
      marginBottom: "1rem", // Space below the review text
    },
    star: {
      color: "yellow-400", // Color for star icons
      marginRight: "0.25rem", // Space between stars
    },
    reviewDetails: {
      display: "flex",
      alignItems: "center", // Aligns items in the review details section
    },
    separator: {
      width: "1px",
      backgroundColor: "gray-900",
      height: "2.5rem", // Height of the vertical separator
      margin: "0 1rem", // Space around the separator
    },
  },
};
export default Reviews;
