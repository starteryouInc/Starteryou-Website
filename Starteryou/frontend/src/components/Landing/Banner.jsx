const Banner = () => {

  const { isAdmin } = useNavigation();
  const [title, setTitle] = useState("Banner Title");
  const [paragraph, setParagraph] = useState("Perfectly working Banner");
  const [isEditing, setIsEditing] = useState(false);
  const page = "HomePage";

  const handleEdit = () => isAdmin && setIsEditing(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          params: { page, component: "Banner" },
        }
      );

      setTitle(data?.content || "");
      setParagraph(
        Array.isArray(data?.paragraphs) ? data.paragraphs.join("\n") : ""
      );
    } catch (error) {
      console.error("Error fetching textData of BannerComp:", error);
    }
  };

  const saveContent = async () => {
    try {
      const noramlizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.textApi}`,
        {
          page: "HomePage",
          component: "Banner",
          content: title.trim(),
          paragraphs: noramlizedParagraphs,
        }
      );
      setIsEditing(false);
      console.log("BannerComp Data is saved: ", response);
    } catch (error) {
      console.log(
        "Error occured while saving the content(BannerComp): ",
        error
      );
      // console.log("Bug fixing")
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-4">
      {" "}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

    return (
      <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-4">

        {" "}
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {" "}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
              LOREM IPSUM DOLOR SIT AMET
            </h1>
            <p className="text-[#767676] mb-4 lg:max-w-[800px]">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet do Lorem ipsum dolor sit
              amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet do.
            </p>
            <button className="px-6 py-3 bg-[#D9502E] text-white rounded-md">
              Learn more
            </button>
          </div>
          {/*  Image */}
          <div className="md:flex-1 md:max-w-[35%] hidden md:block">
            {" "}
            {/* Reduced max width */}
            <img
              src="/LandingPage/Icons/Banner.png"
              alt="Placeholder"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default Banner;
  