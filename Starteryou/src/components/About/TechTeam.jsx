const teamMembers = [
  {
    imgSrc: "/AboutPage/TechTeam/rohit1.jpg",
    position: "Title",
    name: "John Doe",
    about: "the quick fox jumps over the lazy dog",
  },
  {
    imgSrc: "/AboutPage/TechTeam/member2.jpg",
    position: "Title",
    name: "lorem ipsum",
    about: "the quick fox jumps over the lazy dog",
  },
];

const TechTeam = () => {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl text-[#252B42] md:text-4xl font-bold  mb-4 text-center">
        Our Tech Team
      </h2>
      <p className="text-center text-[#737373] mb-10 max-w-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white max-w-sm"
          >
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-[#2C9DDD]">
              {member.position}
            </h3>
            <p className="text-lg font-semibold text-[#252B42]">
              {member.name}
            </p>
            <p className="text-center text-[#737373] mt-2">{member.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechTeam;
