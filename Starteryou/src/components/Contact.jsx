const Contact = () => {
  return (
    <div className="relative bg-white mb-20 overflow-hidden">
      {/* Main Image */}
      <div className="w-full h-[500px] lg:h-[570px] z-10 ">
        <img
          src="/LandingPage/Rectangle_contact.svg"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        {/* Circle on Top Left */}
        <div className="hidden md:block absolute top-[-2.5rem] left-[-1.75rem] w-[35rem] h-[38rem] blur-[100px] z-0 rounded-full bg-[#3D43CFB2] overflow-auto opacity-[0.2]"></div>
        {/* Circle on Top Right */}
        <div className="hidden md:block absolute top-5 right-5 w-[30rem] h-[30rem] blur-[60px] z-0 rounded-full bg-[#C791F24D] overflow-auto opacity-[0.5]"></div>
      </div>

      {/* Rotated image */}
      <div className="hidden md:block absolute left-[31px] top-[439px] z-20 transform rotate-[0.37deg] lg:left-[60px] lg:top-[550px]">
        <img
          src="/LandingPage/Rectangle_cont2.svg"
          alt="Small Rotated"
          className="w-24 lg:w-32 h-20 object-cover"
        />
      </div>
      {/* Smaller left side image */}
      <div className="hidden md:block absolute left-[12px] top-[505px] z-20 transform rotate-[0.37deg] lg:left-[30px] lg:top-[620px]">
        <img
          src="/LandingPage/Rectangle_cont2.svg"
          alt="Smaller Rotated"
          className="w-20 h-10 object-cover"
        />
      </div>
      {/* Right side image */}
      <div className="hidden md:block absolute right-[31px] top-[354px] z-20 transform rotate-[0.37deg] lg:right-[50px] lg:top-[370px]">
        <img
          src="/LandingPage/Rectangle_cont2.svg"
          alt="Small Rotated"
          className="w-24 lg:w-32 h-20 object-cover"
        />
      </div>
      {/* Smaller Rightside image */}
      <div className="hidden md:block absolute right-[70px] top-[420px] z-20 transform rotate-[0.37deg] lg:right-[130px] lg:top-[440px]">
        <img
          src="/LandingPage/Rectangle_cont2.svg"
          alt="Smaller Rotated"
          className="w-20 h-10 object-cover"
        />
      </div>
      {/* Contact form */}
      <div className="container mx-auto px-4 mt-[-20rem]">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 relative z-0">
          <h2 className="text-3xl font-normal text-center mb-6">Contact Us</h2>
          <form className="space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                className="w-full px-4 py-2 border bg-[#F5F5FF] border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                className="w-full px-4 py-2 border bg-[#F5F5FF] border-gray-300 rounded-md"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <input
                type="tel"
                className="w-full px-4 py-2 border bg-[#F5F5FF] border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Location Input */}
            <div>
              <input
                type="text"
                className="w-full px-4 py-2 border bg-[#F5F5FF] border-gray-300 rounded-md"
                placeholder="Enter your location"
              />
            </div>

            {/* Message Input */}
            <div>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border bg-[#F5F5FF] border-gray-300 rounded-md"
                placeholder="Go ahead, we are listening..."
              ></textarea>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <p className="text-lg font-extralight mb-2">
                Preferred contact method
              </p>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="phone"
                    className="mr-2 w-5 h-5 text-[#7950F2] border-gray-300 rounded focus:ring-[#7950F2] checked:bg-[#7950F2]"
                  />
                  <label htmlFor="phone" className="text-sm">
                    Phone
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email"
                    className="mr-2 w-5 h-5 text-[#7950F2] border-gray-300 rounded focus:ring-[#7950F2] checked:bg-[#7950F2]"
                  />
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-[#D9502E] text-white px-4 py-2 rounded-md font-extrabold text-lg leading-relaxed shadow"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
