const jobData = [
  {
    img: "/JobPortalPage/Placeholder Image.png",
    position: "Software Engineer",
    category: "IT",
    type: "Full-time",
    sector: "Technology",
    description: "Develop and maintain software applications.",
  },
  {
    img: "/JobPortalPage/Placeholder Image.png",

    position: "Marketing Specialist",
    category: "Marketing",
    type: "Part-time",
    sector: "Advertising",
    description: "Plan and execute marketing strategies.",
  },
  {
    img: "/JobPortalPage/Placeholder Image.png",

    position: "Data Analyst",
    category: "Analytics",
    type: "Contract",
    sector: "Finance",
    description: "Analyze and interpret complex data sets.",
  },
  {
    img: "/JobPortalPage/Placeholder Image.png",

    position: "Graphic Designer",
    category: "Design",
    type: "Freelance",
    sector: "Creative",
    description: "Create visual concepts and designs.",
  },
  {
    img: "/JobPortalPage/Placeholder Image.png",

    position: "HR Manager",
    category: "Human Resources",
    type: "Full-time",
    sector: "Corporate",
    description: "Manage recruitment and employee relations.",
  },
  {
    img: "/JobPortalPage/Placeholder Image.png",

    position: "Sales Executive",
    category: "Sales",
    type: "Full-time",
    sector: "Retail",
    description: "Drive sales and manage client relationships.",
  },
];

const CareerOptions = () => {
  return (
    <div className="flex flex-col items-center py-16">
      {/* Header Section */}
      <h1 className="text-xl font-semibold">Jobs</h1>
      <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-3">
        Explore Your Career Options
      </h2>
      <p className="text-black mt-1 mb-8 md:mb-12 text-center">
        Discover exciting job opportunities tailored for you.
      </p>

      {/* Job Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 px-4 md:px-8">
        {jobData.map((job, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={job.img}
              alt={job.position}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              {/* Job Position */}
              <h3 className="font-semibold text-lg mb-2">{job.position}</h3>

              {/* Tags */}
              <div className="flex gap-2 text-sm mb-4">
                <span className="bg-gray-200 px-2 py-1 rounded">
                  {job.category}
                </span>
                <span className="bg-gray-200 px-2 py-1 rounded">
                  {job.type}
                </span>
                <span className="bg-gray-200 px-2 py-1 rounded">
                  {job.sector}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <button className="mt-10  text-black border border-black  hover:bg-black hover:text-white px-6 py-2  ">
        View All
      </button>
    </div>
  );
};

CareerOptions.metadata = {
  componentName: "CareerOptions",
  description:
    "A component that displays a grid of job opportunities, allowing users to explore various career options across different sectors.",
  features: {
    jobListing: true, // Displays job listings with relevant details
    responsiveDesign: true, // Adapts layout for different screen sizes
    viewAllButton: true, // Includes a button to view all job opportunities
  },
  jobData: [
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "Software Engineer",
      category: "IT",
      type: "Full-time",
      sector: "Technology",
      description: "Develop and maintain software applications.",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "Marketing Specialist",
      category: "Marketing",
      type: "Part-time",
      sector: "Advertising",
      description: "Plan and execute marketing strategies.",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "Data Analyst",
      category: "Analytics",
      type: "Contract",
      sector: "Finance",
      description: "Analyze and interpret complex data sets.",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "Graphic Designer",
      category: "Design",
      type: "Freelance",
      sector: "Creative",
      description: "Create visual concepts and designs.",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "HR Manager",
      category: "Human Resources",
      type: "Full-time",
      sector: "Corporate",
      description: "Manage recruitment and employee relations.",
    },
    {
      img: "/JobPortalPage/Placeholder Image.png",
      position: "Sales Executive",
      category: "Sales",
      type: "Full-time",
      sector: "Retail",
      description: "Drive sales and manage client relationships.",
    },
  ],
  accessibility: {
    viewAllButton: "View all available job opportunities",
  },
  styles: {
    container: {
      padding: "4rem 0", // Vertical padding for the container
    },
    header: {
      title: {
        fontSize: "2rem", // Font size for the main title
        fontWeight: "bold",
      },
      subtitle: {
        fontSize: "1.5rem", // Font size for the subtitle
        fontWeight: "semibold",
      },
    },
    jobCard: {
      backgroundColor: "white",
      shadow: "md", // Shadow for job cards
      borderRadius: "lg", // Rounded corners for job cards
    },
    jobPosition: {
      fontSize: "1.25rem", // Font size for job position
      fontWeight: "semibold",
    },
    tags: {
      backgroundColor: "#E5E7EB", // Gray background for tags
      borderRadius: "0.375rem", // Rounded corners for tags
    },
    button: {
      backgroundColor: "white",
      borderColor: "black",
      padding: "0.5rem 1.5rem",
      hover: {
        backgroundColor: "black",
        textColor: "white",
      },
    },
  },
};

export default CareerOptions;
