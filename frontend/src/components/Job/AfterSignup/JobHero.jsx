import Navbar from "../../Common/Navbar";

const JobHero = () => {
  return (
    <div>
      <Navbar isEduHero={true} />

      <div className="bg-white h-screen flex items-center">
        <div className="max-w-[500px] mx-8 md:mx-20">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-4 ">
            Discover Your Ideal Career Path Today!
          </h1>
          <p className="text-gray-600 mb-6">
            Explore a plethora of job opportunities tailored for college
            students. Your dream job is just a search away!
          </p>
          <div className="flex space-x-4">
            <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
              Search
            </button>
            <button className=" text-black px-6 py-2 rounded-xl border border-black">
              Find
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

JobHero.metadata = {
  componentName: "JobHero",
  description:
    "A hero section component designed to capture users' attention and encourage them to explore job opportunities tailored for college students.",
  features: {
    navbarIntegration: true, // Integrates a navigation bar at the top
    responsiveDesign: true, // Adapts layout for different screen sizes
    callToAction: true, // Provides buttons for user interaction
  },
  callToActionButtons: [
    {
      text: "Search",
      style: "primary", // Indicates a primary action
    },
    {
      text: "Find",
      style: "secondary", // Indicates a secondary action
    },
  ],
  accessibility: {
    buttonLabels: {
      search: "Search for job opportunities",
      find: "Find jobs tailored for you",
    },
  },
  styles: {
    container: {
      backgroundColor: "white",
      height: "100vh", // Full viewport height
      display: "flex",
      alignItems: "center", // Vertically centers the content
    },
    title: {
      fontSize: "2rem", // Font size for the main title
      fontWeight: "bold",
      color: "gray-800", // Text color for the title
      marginBottom: "1rem", // Space below the title
    },
    description: {
      color: "gray-600", // Text color for the description
      marginBottom: "1.5rem", // Space below the description
    },
    button: {
      padding: "0.5rem 1rem", // Padding for buttons
      borderRadius: "0.75rem", // Rounded corners for buttons
    },
  },
};
export default JobHero;
