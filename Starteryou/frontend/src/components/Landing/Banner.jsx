/**
 * @module Banner
 * @description A responsive banner component that displays a heading, description text,
 * a call-to-action button, and an optional image on larger screens.
 * The component uses a two-column layout on desktop and stacks vertically on mobile.
 */

/**
 * @function Banner
 * @description Renders a full-width banner section with text content and an image
 * @returns {JSX.Element} A responsive banner component with the following features:
 * - Responsive padding and layout (vertical on mobile, horizontal on desktop)
 * - Left column with heading, paragraph text, and CTA button
 * - Right column with image (hidden on mobile)
 * - Maximum width constraint of 1440px
 * - Custom color scheme using Tailwind CSS classes
 */
const Banner = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-4">
      {" "}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {" "}
        {/* Text Content Column */}
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

        {/* Image Column - Hidden on mobile */}
        <div className="md:flex-1 md:max-w-[35%] hidden md:block">
          {" "}
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