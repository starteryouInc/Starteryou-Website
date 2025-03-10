export default function StartJourney() {
  return (
    <div className=" mx-auto max-w-[1430px] px-4 lg:px-10 md:py-20   ">
      <div className="flex flex-col md:flex-row justify-between items-center py-16 gap-y-6 md:gap-y-0 ">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-2 md:mb-3">
            Start your Learning journey
          </h1>
          <p>Discover courses and schools tailored for you.</p>
        </div>
        <div className="flex gap-x-3 ">
          <button className="bg-black text-white px-4 py-2">Sign Up</button>
          <button className="bg-white text-black border border-black px-4 py-2">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
  StartJourney.metadata = {
    componentName: "StartJourney",
    description:
      "A simple component that encourages users to begin their learning journey by exploring available courses and schools. It includes calls to action for signing up or logging in.",
    features: {
      callToAction: true, // Includes buttons for Sign Up and Log In
      responsiveDesign: true, // Layout adjusts for different screen sizes
    },
    accessibility: {
      headings: [
        {
          level: 1,
          text: "Start your Learning journey",
        },
      ],
      buttons: {
        signUp: "Sign Up",
        logIn: "Log In",
      },
    },
    styles: {
      container: {
        maxWidth: "1430px",
        paddingX: "1rem", // 4 (px) when using Tailwind's padding
        paddingY: "5rem", // 20 (px) for larger screens
      },
      title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "black",
      },
      description: {
        fontSize: "1rem",
        color: "black",
      },
      button: {
        signUp: {
          backgroundColor: "black",
          textColor: "white",
        },
        logIn: {
          backgroundColor: "white",
          borderColor: "black",
          textColor: "black",
        },
      },
    },
  };
}
