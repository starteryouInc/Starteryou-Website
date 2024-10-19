const Collab = () => {
  const images = [
    { src: "https://via.placeholder.com/150X80", alt: "Placeholder 1" },
    { src: "https://via.placeholder.com/150X80", alt: "Placeholder 2" },
    { src: "https://via.placeholder.com/150X80", alt: "Placeholder 3" },
    { src: "https://via.placeholder.com/150X80", alt: "Placeholder 4" },
    { src: "https://via.placeholder.com/150X80", alt: "Placeholder 5" },
  ];

  return (
    <div className="px-4 ">
      <div className="relative bg-[#E9F0FF] py-10 lg:my-4 max-w-[1300px] mx-auto rounded-xl overflow-hidden px-6">
        {/* Circle top */}
        <div className="absolute top-[-89px] left-[-36px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />
        {/* Circle bottom */}
        <div className="absolute bottom-[-100px] right-[-27px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />

        <div className="relative z-10 text-center">
          <p className="text-base text-gray-600">Trusted By 20,000 students</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-2">
            They Trust Us
          </h2>
          <hr className="border-[#C0C0C0] border-[1.27px] w-full max-w-[1200px] mx-auto mt-6" />
        </div>

        {/* Images */}
        <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1200px] mx-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="w-full rounded-lg px-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collab;
