/**
 * @module Collab
 * @description A React component that showcases collaboration partners or trusted organizations
 * Features a responsive grid layout with decorative background elements and trust indicators
 */

/**
 * @typedef {Object} CollabImage
 * @property {string} src - Source URL of the collaborator's image
 * @property {string} alt - Alternative text for the image
 */

/**
 * @function Collab
 * @description Renders a section displaying trusted partners or collaborators
 * Features a responsive grid of logos, decorative elements, and trust metrics
 * @returns {JSX.Element} A trust-building section with partner logos
 */
const Collab = () => {
  /**
   * @constant {CollabImage[]} images
   * @description Array of collaborator images with their metadata
   * Currently using placeholder images that should be replaced with actual partner logos
   */
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
        {/* Decorative Elements */}
        {/* Top circular gradient */}
        <div className="absolute top-[-89px] left-[-36px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />
        {/* Bottom circular gradient */}
        <div className="absolute bottom-[-100px] right-[-27px] w-[200px] h-[200px] bg-gradient-to-br from-[rgba(172,178,246,0.5)] to-[rgba(183,205,249,0.5)] rounded-full z-0 blur-md" />

        {/* Content Section */}
        <div className="relative z-10 text-center">
          <p className="text-base text-gray-600">Trusted By 20,000 students</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-2">
            They Trust Us
          </h2>
          <hr className="border-[#C0C0C0] border-[1.27px] w-full max-w-[1200px] mx-auto mt-6" />
        </div>

        {/* Partner Logo Grid */}
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