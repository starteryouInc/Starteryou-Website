const teamMembers = [
  {
    imgSrc: "/AboutPage/Team/ceo.jpg",
    position: "CEO",
    name: "Michael Berlingo",
    about: "Leading the company with a vision.",
  },
  {
    imgSrc: "/AboutPage/Team/cso.jpg",
    position: "CSO",
    name: "Anthony Ivanov",
    about: "In charge of technology and innovation.",
  },
  {
    imgSrc: "/AboutPage/Team/cto.jpg",
    position: "CTO",
    name: "Nikshep A Kulli",
    about: "Managing the company’s finances.",
  },
  {
    imgSrc: "/AboutPage/Team/sales.jpg",
    position: "SALES OFFICER",
    name: "Ujjwal Geed",
    about: "Overseeing operations and strategies.",
  },
  {
    imgSrc: "/AboutPage/Team/market.jpg",
    position: "MARKETING MANAGER",
    name: "Rushikesh Balkrushna Solanke",
    about: "Leading the marketing team.",
  },
];

const Team = () => {
  return (
    <div className="bg-white py-20 px-4 text-center">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold  mb-8 md:mb-10">
        Meet Our Team
      </h2>
      {/* <p className="text-gray-600 max-w-[800px] mx-auto  mb-8 md:mb-10">
          Our team of passionate professionals brings a wealth of expertise to
          ensure the best experience for our customers. Together, we work towards
          delivering exceptional service and innovation.
        </p> */}

      {/* Top row*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-[930px] mx-auto">
        {teamMembers.slice(0, 3).map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md h-[350px] rounded-md"
          >
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-[#D9502E] mb-2">
              {member.position}
            </h3>
            <p className="text-lg mb-3 font-semibold text-[#252B42]">
              {member.name}
            </p>
            <p className="text-gray-600">{member.about}</p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 justify-center max-w-[620px] mx-auto mt-8">
        {teamMembers.slice(3).map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] p-6 shadow-md h-[350px] rounded-md"
          >
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-[#D9502E] mb-2">
              {member.position}
            </h3>
            <p className="text-lg font-semibold mb-3 text-[#252B42]">
              {member.name}
            </p>
            <p className="text-gray-600">{member.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
