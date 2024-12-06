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

export default JobHero;
