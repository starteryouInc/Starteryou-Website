import { useState } from "react";
import FileUpload from "../Common/FileUpload";
import { useNavigation } from "../../context/NavigationContext";

const OurInsight = () => {
  const { isAdmin } = useNavigation();
  const [insightImages, setInsightImages] = useState({
    1: "/JobPortalPage/Placeholder Image.png",
    2: "/JobPortalPage/Placeholder Image.png",
    3: "/JobPortalPage/Placeholder Image.png",
  });

  const insights = [
    {
      id: 1,
      type: "Education",
      time: "5 min read",
      title: "The Future of Online Learning",
      description:
        "Discover how online education is transforming the learning landscape.",
      link: "/read-more-1",
    },
    {
      id: 2,
      type: "Career",
      time: "5 min read",
      title: "Building Your Professional Network",
      description:
        "Learn effective strategies for networking in today's job market.",
      link: "/read-more-2",
    },
    {
      id: 3,
      type: "Learning",
      time: "5 min read",
      title: "Top Skills for Future Careers",
      description:
        "Identify essential skills that will boost your employability.",
      link: "/read-more-3",
    },
  ];

  // Handle image upload for insights
  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInsightImages((prevState) => ({
          ...prevState,
          [id]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-16 ">
      <div className="text-center">
        <h1 className="text-md font-semibold text-black">Blog</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-black mt-3 ">
          Explore Our Latest Insights
        </h2>
        <p className="mt-2 text-black">
          Stay ahead with our educational resources and tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-auto max-w-[1430px]  px-4 lg:px-10">
        {insights.map(({ id, type, time, title, description, link }) => (
          <div key={id} className=" overflow-hidden">
            <img
              src={insightImages[id]}
              alt={title}
              className="w-full h-56 object-cover relative"
            />
            {isAdmin && (
              <div className="relative top-0 right-2 ">
                <FileUpload
                  handleFileChange={(e) => handleImageUpload(e, id)}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex gap-4  items-center text-sm text-black mb-4">
                <div className="bg-[#EEEEEE] py-1 px-2">
                  <span className="font-semibold">{type}</span>
                </div>
                <span className="font-semibold">{time}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-black mb-4">{description}</p>
              <a href={link} className="text-black hover:underline">
                Read more &gt;
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 md:mt-16 flex justify-center">
        <button className="bg-white text-black border border-black py-2 px-4  mr-4">
          View all
        </button>
      </div>
    </section>
  );
};

export default OurInsight;
