import {useState, useEffect} from "react";
import FileUpload from "../Common/FileUpload";
import {useNavigation} from "../../context/NavigationContext";
import {API_CONFIG} from "../../config/api";

const BestJob = () => {
  const {isAdmin} = useNavigation();
  const [image1, setImage1] = useState("/LandingPage/Rectangle.png");
  const [image2, setImage2] = useState("/LandingPage/Heroimg2.jpg");

  const titles = ["bestJob1", "bestJob12"]; // Titles to fetch and update each image

  // Fetch each image based on its title
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const responses = await Promise.all(
          titles.map(async (title) => {
            const response = await fetch(
              `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle(title)}`
            );
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            return URL.createObjectURL(blob); // Return image URL
          })
        );
        setImage1(responses[0]);
        setImage2(responses[1]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  // Handle image update for each image
  const handleFileChange = async (e, imageSetter, title) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title); // Set the title for update
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const newImageUrl = URL.createObjectURL(file); // Update preview
      imageSetter(newImageUrl);
      console.log(`Image updated successfully for ${title}`);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-[1300px] px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section */}
        <div className="md:w-full lg:w-1/3 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Find the best jobs that define you.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            See new openings &gt;
          </a>
        </div>

        {/* Right Section */}
        <div className="w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl relative">
          {/* First Image */}
          <img
            src={image1}
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[25px] left-[30px] md:w-[320px] md:left-[50px] lg:top-[47px] lg:left-[70px] lg:w-[440px] lg:h-[300px] rounded-xl"
          />
          {isAdmin && (
            <div>
              <FileUpload
                handleFileChange={(e) =>
                  handleFileChange(e, setImage1, titles[0])
                }
              />
            </div>
          )}

          {/* Second Image */}
          <img
            src={image2}
            alt="Job Opportunities"
            className="relative w-[220px] h-[170px] top-[-68px] left-[80px] md:left-[180px] md:w-[320px] lg:top-[-112px] lg:left-[190px] lg:w-[420px] lg:h-[300px] rounded-xl z-10"
          />
          {isAdmin && (
            <div className="relative bottom-32">
              <FileUpload
                handleFileChange={(e) =>
                  handleFileChange(e, setImage2, titles[1])
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestJob;
