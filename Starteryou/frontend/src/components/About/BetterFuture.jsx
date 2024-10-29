import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const BetterFuture = () => {
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

  return (
    <div className="max-w-[1300px] mx-auto text-center p-6 pt-24 md:pb-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold md:font-extrabold mb-4 text-[#252B42]">
        Build Better Future
      </h1>

      {/* Description */}
      <p className="text-[#737373] mb-8 md:mb-14 max-w-[600px] mx-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      {/* Box Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 py-5 md:py-10">
        {/* Video Box */}
        <div className="relative w-full h-auto">
          <div className="relative overflow-hidden rounded-sm shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-[300px] md:h-[400px] object-cover "
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

        {/* Text Box */}
        <div className="flex flex-col bg-white p-2 md:p-6 justify-center  ">
          <h2 className="text-3xl font-semibold text-start text-[#252B42] pb-3">
            Most trusted in our field
          </h2>
          <p className="text-[#737373] text-start max-w-[400px] text-base pb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {/* Two Small Box*/}
          <div className="mt-6 space-y-4">
            {/* Box 1 */}
            <div className="flex items-center space-x-4">
              <img
                src="/AboutPage/better1.svg"
                alt="Image 1"
                className="w-7 h-7 object-cover"
              />
              <div>
                <h3 className="text-xl text-left font-semibold text-[#252B42]">
                  Title 1
                </h3>
                <p className="text-[#737373] text-left text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="flex items-center space-x-4">
              <img
                src="/AboutPage/better2.svg"
                alt="Image 2"
                className="w-7 h-7 object-cover"
              />
              <div>
                <h3 className="text-xl text-left font-semibold text-[#252B42]">
                  Title 2
                </h3>
                <p className="text-[#737373] text-left text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetterFuture;
