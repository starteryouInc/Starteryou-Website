import { faStar } from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ResetCode = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (value, index) => {
    // Restrict input to single digit
    if (!/^\d?$/.test(value)) return;

    // Update the OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next field if value is entered
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("Submitted OTP:", otpCode);

    // Perform OTP verification logic here

    // Redirect after submission
    navigate("/UpdatePswd");
  };
  const reviews = [
    {
      stars: 5,
      text: "Working with Starteryou has transformed our hiring process, connecting us with talented students eager to contribute. Their platform is a game-changer for companies looking to tap into fresh talent.",
      name: "Sarah Davis",
      position: "HR Manager",
      userImg: "/Reviewer/avatar-1.jpg.svg",
    },
    {
      stars: 4,
      text: "Starteryou helped us find the right talent quickly and efficiently. Their platform makes the recruitment process seamless and enjoyable.",
      name: "Jane Smith",
      position: "Talent Acquisition Lead",
      userImg: "/Reviewer/avatar-3.jpg",
    },
    {
      stars: 5,
      text: "This platform has been a vital tool for our hiring needs. The quality of talent we’ve encountered through Starteryou is unmatched.",
      name: "Emily Johnson",
      position: "Recruitment Specialist",
      userImg: "/Reviewer/avatar-2.jpg.svg",
    },
    {
      stars: 4,
      text: "Starteryou offers an intuitive platform that connects us to top-tier talent. It’s been an incredible asset to our team.",
      name: "Michael Brown",
      position: "Operations Manager",
      userImg: "/Reviewer/avatar-4.jpeg",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
      {/* Left Section */}
      <div className="relative hidden  w-full lg:w-2/5 bg-[#6A54DF] md:flex flex-col text-white p-8 overflow-hidden">
        {/* Circle in the top-left */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Circle in the bottom-right */}
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"></div>

        <div className="mt-20 ml-16 flex flex-col justify-center items-start">
          <h1 className="text-4xl lg:text-5xl font-bold">Welcome Back!</h1>
          <p className="mt-4 text-lg max-w-[400px]">
            Starteryou makes it easy for students to navigate job applications
            and land the perfect role.
          </p>
        </div>

        {/* Slider Box */}
        <div className="flex flex-col mt-24 ml-6 bg-[#6A54DF] p-4 md:p-6 justify-center">
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
                <p className="text-white mb-4 text-left text-base font-light">
                  &quot;{review.text}&quot;
                </p>
                {/* Review Details */}
                <div className="flex items-center text-left">
                  <img
                    src={review.userImg} // Assuming review.userImg holds the image URL
                    alt={review.name}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      objectFit: "cover",
                    }} // Width is set to 3rem and height is equal for circular shape
                    className="rounded-full mr-4"
                  />
                  {/* Name and Position */}
                  <div>
                    <h3 className="text-white font-bold">{review.name}</h3>
                    <p className="text-white">{review.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/5 bg-white flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden relative">
        {/* Circle in the top-left */}
        <div className="md:hidden h-32 w-32 max-w-[8rem] max-h-[8rem] bg-transparent border-4 border-[#8574e4] rounded-full absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Circle in the bottom-right */}
        <div className="md:hidden h-32 w-32 bg-transparent border-4 border-[#8574e4] rounded-full absolute bottom-[39px] right-[13px] transform translate-x-1/2 translate-y-1/2"></div>

        <div className="w-full lg:w-3/4 max-w-md">
          <h2 className="text-3xl font-bold mb-2">Enter OTP</h2>
          <p className="text-gray-600 mb-6">
            We’ve sent a 4-digit code to your registered email. Please enter it
            below to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP Fields */}
            <div className="flex  gap-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  required
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-xl font-semibold rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#6A54DF]  text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetCode;
