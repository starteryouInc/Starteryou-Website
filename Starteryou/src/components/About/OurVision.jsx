const OurVision = () => {
    return (
      <div className="max-w-[1300px] mx-auto container px-4 py-10">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Text Box */}
          <div className="bg-white p-6 mb-4 md:mb-0 flex-1 flex flex-col justify-center md:order-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1F2329] uppercase">
                OUR Vision
              </h2>
              <p className="text-[#1F2329] text-base">
                Starteryou envisions a world where every student has access to
                diverse job opportunities, gaining essential work experience and
                building a foundation for their future careers. We aspire to be
                the go-to Student Employment Hub, continually innovating and
                expanding our offerings to enhance the job-seeking journey for
                both students and employers.
              </p>
            </div>
          </div>
  
          {/* Image Box */}
          <div
            className="flex-1 bg-cover bg-center rounded-lg mb-4 md:mb-0 h-[200px] min-h-[200px] md:h-[300px] md:min-h-[400px]"
            style={{
              backgroundImage: "url('/AboutPage/vision.svg')",
            }}
          ></div>
        </div>
      </div>
    );
  };
  
  export default OurVision;
  