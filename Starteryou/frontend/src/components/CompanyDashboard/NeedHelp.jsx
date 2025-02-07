import React from "react";

const NeedHelp = () => {
  return (
    <div className="need-help w-[370px] h-[240px] px-4 bg-[#f2fce2] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-[18px] text-[#736F79] font-bold">Need Help?</h2>
      <h4 className="text-[#b8beb8]">Our support team is here to assist you</h4>
      <button className="w-full p-3 border border-[#c8c0f2] bg-[#ffffff] text-[#c8c0f2]">
        Contact Support
      </button>
    </div>
  );
};

export default NeedHelp;
