import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "../../context/NavigationContext";

const DiscoverPath = () => {
  const [opportunities, setOpportunities] = useState([
    {
      img: "/JobPortalPage/Placeholder Image.png",
      title:
        "Gain Real-World Experience with Internships and Part-Time Opportunities",
      description:
        "Explore valuable internships and part-time jobs tailored for your academic journey.",
      linkText: "Apply",
      linkUrl: "#",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      title: "Access Essential Career Resources to Boost Your Job Search",
      description:
        "Utilize our comprehensive resources to enhance your job readiness and skills.",
      linkText: "Learn",
      linkUrl: "#",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      title:
        "Streamlined Job Listings for Students Seeking Flexible Work Options",
      description:
        "Find job listings that cater to your unique schedule and academic commitments.",
      linkText: "Browse",
      linkUrl: "#",
    },
  ]);

  const { isAdmin } = useNavigation();

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newImageUrl = URL.createObjectURL(file);

    // Update the image for the specific opportunity
    const updatedOpportunities = opportunities.map((opportunity, i) =>
      i === index ? { ...opportunity, img: newImageUrl } : opportunity
    );
    setOpportunities(updatedOpportunities);
  };

  return (
    <div className="mx-auto max-w-[1430px] px-4 lg:px-10 py-16">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:pb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 md:mb-0 text-black md:text-left md:max-w-[320px] lg:max-w-[600px]">
          Discover Your Path: Opportunities for Students at Your Fingertips
        </h1>
        <p className="mt-1 md:mt-0 text-black text-base  md:max-w-[400px] lg:max-w-[540px]">
          Our platform simplifies the job application process for college
          students. With just a few clicks, you can apply for internships and
          part-time jobs that fit your schedule. Say goodbye to complicated
          applications and hello to your future!
        </p>
      </div>

      {/* Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {opportunities.map((opportunity, index) => (
          <div key={index} className="relative">
            <img
              src={opportunity.img}
              alt={opportunity.title}
              className="relative w-[500px] h-[250px] mb-4"
            />
            {isAdmin && (
              <div className="absolute top-4 right-4">
                <label
                  htmlFor={`file-upload-${index}`}
                  className="cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                    <FontAwesomeIcon icon={faUpload} size="lg" />
                  </div>
                </label>
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="hidden"
                  aria-label="Upload Image"
                />
              </div>
            )}
            <h2 className="text-lg font-semibold mb-2 px-1 ">
              {opportunity.title}
            </h2>
            <p className="text-sm mb-4 px-1">{opportunity.description}</p>
            <a
              href={opportunity.linkUrl}
              className="text-blue-500 font-bold px-1"
            >
              {opportunity.linkText} &gt;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPath;
