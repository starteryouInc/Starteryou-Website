const pricingData = [
  {
    title: "Starter",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
    price: "$0/",
    priceText: "Month",
    buttonText: "Try For Free",
    buttonColor: "border border-[#3370FF]",
    textColor: "text-[#3370FF]",
    features: [
      "Lorem ipsum dolor sit amet, consectetuer",
      "Sed  nonummy nibh euismod",
      "Tempor incididunt ut labore",
      "Magna aliquam erat volutpat",
      "Dolore magna aliquam erat",
    ],
  },
  {
    title: "Pro",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
    price: "$29/",
    priceText: "Month",
    buttonText: "Contact Us",
    buttonColor: "bg-[#D9502E]",
    textColor: "text-white",
    features: [
      "Lorem ipsum dolor sit amet, consectetuer",
      "Sed diam nonummy nibh euismod",
      "Tempor incididunt ut labore",
      "Magna aliquam erat volutpat",
      "Dolore magna aliquam erat",
    ],
  },
  {
    title: "Enterprise",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
    price: "$99/",
    priceText: "Month",
    buttonText: "Contact Us",
    buttonColor: "border border-[#3370FF]",
    textColor: "text-[#3370FF]",
    features: [
      "Lorem ipsum dolor sit amet, consectetuer",
      "Sed diam nonummy nibh euismod",
      "Tempor incididunt ut labore",
      "Magna aliquam erat volutpat",
      "Dolore magna aliquam erat",
    ],
  },
];

const Pricing = () => {
  return (
    <div className=" relative flex flex-col items-center justify-center py-16  px-4 md:px-12 lg:px-24">
      {/*  Heading */}
      <h2 className="text-3xl font-extrabold text-center mb-20">
        It’s easy to get started
      </h2>

      {/* Pricing Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {pricingData.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-start justify-between z-10 p-8 rounded-lg bg-white 
            ${
              index === 1
                ? "lg:-translate-y-6 shadow-[0px_4.78px_52.63px_0px_#65656540]"
                : "shadow-lg"
            }
            ${
              index === 2
                ? "md:col-span-2 md:w-1/2 md:mx-auto lg:col-span-1 lg:w-full lg:mx-0 "
                : ""
            }
            `}
          >
            <h3 className="text-2xl font-medium italic mb-2">{plan.title}</h3>

            <p className="text-gray-600 italic mb-6">{plan.description}</p>

            <div className="flex items-baseline mb-6">
              <p className="text-4xl font-medium italic text-[#7950F2]">
                {plan.price}
              </p>
              <span className="text-lg font-medium text-[#7950F2] italic ml-1">
                {plan.priceText}
              </span>
            </div>

            <button
              className={`${plan.buttonColor} ${plan.textColor} w-full py-3 rounded-lg mb-6 mx-2`}
            >
              {plan.buttonText}
            </button>

            {/* Features  */}
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-[#3370FF]">✔</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="hidden md:block absolute bottom-[-4rem] left-[-8.75rem] w-[45rem] h-[38rem] blur-[100px] z-0 rounded-full bg-[#3D43CFB2] overflow-auto opacity-[0.2]"></div>
      <div className="hidden lg:block absolute bottom-[-1rem] right-[0rem] w-[45rem] h-[38rem] blur-[100px] z-0 rounded-full bg-[#3D43CFB2] overflow-auto opacity-[0.2]"></div>
    </div>
  );
};
Pricing.metadata = {
  componentName: "Pricing",
  description: "A pricing section component displaying various subscription plans with features and pricing information.",
  features: {
    responsiveDesign: true, // Adapts layout for different screen sizes
    pricingPlans: true, // Displays different pricing plans
    buttonActions: true, // Buttons for each pricing plan with specific actions
  },
  accessibility: {
    buttonLabels: "Buttons should have clear labels indicating their actions (e.g., 'Try For Free', 'Contact Us').",
    featureList: "Features listed should be easily readable with checkmarks for better understanding.",
  },
  styles: {
    container: {
      padding: "py-16 px-4 md:px-12 lg:px-24", // Padding for the pricing section
    },
    heading: {
      fontSize: "text-3xl", // Font size for the heading
      fontWeight: "font-extrabold", // Boldness for the heading
      textAlign: "center", // Center align the heading
      marginBottom: "mb-20", // Bottom margin for spacing
    },
    pricingBox: {
      backgroundColor: "white", // Background color for pricing boxes
      borderRadius: "rounded-lg", // Rounded corners for boxes
      boxShadow: "shadow-lg", // Shadow effect for boxes
      hoverEffect: "lg:-translate-y-6 shadow-[0px_4.78px_52.63px_0px_#65656540]", // Hover effect for the highlighted plan
    },
  },
  pricingData: [
    {
      title: "Starter",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
      price: "$0/",
      priceText: "Month",
      buttonText: "Try For Free",
      buttonColor: "border border-[#3370FF]",
      textColor: "text-[#3370FF]",
      features: [
        "Lorem ipsum dolor sit amet, consectetuer",
        "Sed nonummy nibh euismod",
        "Tempor incididunt ut labore",
        "Magna aliquam erat volutpat",
        "Dolore magna aliquam erat",
      ],
    },
    {
      title: "Pro",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
      price: "$29/",
      priceText: "Month",
      buttonText: "Contact Us",
      buttonColor: "bg-[#D9502E]",
      textColor: "text-white",
      features: [
        "Lorem ipsum dolor sit amet, consectetuer",
        "Sed diam nonummy nibh euismod",
        "Tempor incididunt ut labore",
        "Magna aliquam erat volutpat",
        "Dolore magna aliquam erat",
      ],
    },
    {
      title: "Enterprise",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed ",
      price: "$99/",
      priceText: "Month",
      buttonText: "Contact Us",
      buttonColor: "border border-[#3370FF]",
      textColor: "text-[#3370FF]",
      features: [
        "Lorem ipsum dolor sit amet, consectetuer",
        "Sed diam nonummy nibh euismod",
        "Tempor incididunt ut labore",
        "Magna aliquam erat volutpat",
        "Dolore magna aliquam erat",
      ],
    },
  ],
};
export default Pricing;
