const NewsLetter = () => {
  return (
    <div className="relative bg-[#F8FAFC] p-6 w-full">
      <div className="relative overflow-hidden mx-auto my-12 p-12 lg:p-0 bg-[#6a54df] text-white flex flex-col justify-center items-center rounded-[18px] space-y-4 lg:w-[1166px] lg:h-[266px]">
        {/* Two circles for the top and bottom design */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute -top-20 -left-14"></div>
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute -bottom-20 -right-14"></div>

        <h1 className="text-center text-[38px] font-semibold leading-10">
          Subscribe to our newsletter
        </h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-3">
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8 "
            type="text"
            name="name"
            placeholder="First Name"
          />
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8 "
            type="text"
            name="email"
            placeholder="Email address"
          />
          <button className="subscribe-now-btn bg-[#D9502E] rounded-md py-4 px-8">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
