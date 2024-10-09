const DiscoverPath = () => {
  const opportunities = [
    {
      img: "/LandingPage/Blogimg1.png",
      title:
        "Gain Real-World Experience with Internships and Part-Time Opportunities",
      description:
        "Explore valuable internships and part-time jobs tailored for your academic journey.",
      linkText: "Apply",
      linkUrl: "#",
    },
    {
      img: "/LandingPage/Blogimg1.png",

      title: "Access Essential Career Resources to Boost Your Job Search",
      description:
        "Utilize our comprehensive resources to enhance your job readiness and skills.",
      linkText: "Learn",
      linkUrl: "#",
    },
    {
      img: "/LandingPage/Blogimg1.png",

      title:
        "Streamlined Job Listings for Students Seeking Flexible Work Options",
      description:
        "Find job listings that cater to your unique schedule and academic commitments.",
      linkText: "Browse",
      linkUrl: "#",
    },
  ];

  return (
    <div className="mx-auto px-4 lg:px-10 py-16">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:pb-6">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 md:mb-0 text-black md:text-left md:max-w-[320px] lg:max-w-[600px]">
          Discover Your Path: Opportunities for Students at Your Fingertips
        </h1>
        <p className="mt-4 md:mt-0 text-black text-base md:text-right md:max-w-[400px] lg:max-w-[540px]">
          Our platform simplifies the job application process for college
          students. With just a few clicks, you can apply for internships and
          part-time jobs that fit your schedule. Say goodbye to complicated
          applications and hello to your future!
        </p>
      </div>

      {/* Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {opportunities.map((opportunity, index) => (
          <div key={index}>
            <img
              src={opportunity.img}
              alt={opportunity.title}
              className="w-full h-auto mb-4"
            />
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
