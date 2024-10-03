const OurMission = () => {
  return (
    <div className="max-w-[1300px] mx-auto container px-4 py-10">
      <div className="flex flex-col md:flex-row md:space-x-4 items-center">
        {/* Text Box */}
        <div className="bg-white p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329]">
              OUR MISSION
            </h2>
            <p className="text-[#1F2329] text-base">
              Starteryou is dedicated to empowering students by providing a
              vibrant and inclusive platform for discovering career
              opportunities. We foster a supportive community that bridges the
              gap between students and employers, facilitating skill development
              and guiding them towards meaningful career paths. We aim to
              transform the student learning experience, equipping individuals
              with essential career skills often overlooked in traditional
              education settings. We&apos;re committed to providing the tools
              and opportunities necessary for students to succeed in their
              future careers. Our commitment to innovation, affordability, and
              collaboration ensures that every student can confidently navigate
              their way to valuable work experiences year-round.
            </p>
          </div>
        </div>

        {/* Image Box */}
        <div
          className="flex-1 bg-cover bg-center rounded-lg mb-4 md:mb-0 h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px] "
          style={{
            backgroundImage: "url('https://via.placeholder.com/300')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default OurMission;
