import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Reviews = () => {
  const reviews = [
    {
      title:
        "Starteryou helped me land my first job right after college! The personalized recommendations made all the difference in my job search.",
      username: "Emily Johnson",
      occupation: "Marketing Intern, ABC Corp",
    },
    {
      title:
        "Thanks to Starteryou, I found the perfect role that aligns with my skills and passion. The job matching was spot-on, and the process was seamless.",
      username: "David Thompson",
      occupation: "Junior Software Developer, XYZ Solutions",
    },
    {
      title:
        "Starteryou gave me the confidence to switch careers and pursue my dream job. Their tailored advice and resources were exactly what I needed.",
      username: "Sarah Williams",
      occupation: "Project Manager, Global Tech Inc.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto my-10 md:my-16">
        <Carousel
          showArrows={false}
          showThumbs={false}
          showStatus={false}
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
              <h2 className="text-2xl font-semibold text-black mb-14">
                &quot;{review.title}&quot;
              </h2>
              <p className="text-lg font-medium text-black">
                {review.username}
              </p>
              <p className="text-sm text-black">{review.occupation}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Reviews;
