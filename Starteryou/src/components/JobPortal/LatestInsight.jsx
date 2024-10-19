const insights = [
  {
    id: 1,
    img: "/JobPortalPage/Placeholder Image.png",

    type: "Education",
    time: "5 min read",
    title: "How to Ace Your Interviews",
    description: "Discover tips and strategies to impress your interviewers.",
    link: "/read-more-1",
  },
  {
    id: 2,
    img: "/JobPortalPage/Placeholder Image.png",
    type: "Career",
    time: "5 min read",
    title: "Top 10 Internships for College Students",
    description: "Explore the best internships that enhance your resume.",
    link: "/read-more-2",
  },
  {
    id: 3,
    img: "/JobPortalPage/Placeholder Image.png",

    type: "Lifestyle",
    time: "5 min read",
    title: "Budgeting Tips for Students",
    description: "Learn how to manage your finances effectively as a student.",
    link: "/read-more-3",
  },
];

const LatestInsight = () => {
  return (
    <section className="py-16 bg-[#FAF6FE]">
      <div className="text-center">
        <h1 className="text-md font-semibold text-black">Blog</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-black mt-3 ">
          Latest Insights for Students
        </h2>
        <p className="mt-2 text-black">
          Stay updated with our latest blog posts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-7xl mx-auto px-3">
        {insights.map(({ id, img, type, time, title, description, link }) => (
          <div
            key={id}
            className="bg-[#FAF6FE] border border-black overflow-hidden"
          >
            <img src={img} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex gap-4  items-center text-sm text-black mb-4">
                <div className="bg-[#EEEEEE] py-1 px-2">
                  <span className="font-semibold">{type}</span>
                </div>
                <span className="font-semibold">{time}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
              <a href={link} className="text-black hover:underline">
                Read more &gt;
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 md:mt-20 flex justify-center">
        <button className="bg-[#D9520E] text-white py-2 px-3 rounded-xl mr-4">
          View all
        </button>
      </div>
    </section>
  );
};

export default LatestInsight;
