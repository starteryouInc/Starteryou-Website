import React from "react";
import { GiNetworkBars } from "react-icons/gi";

const JobCard2 = (props) => {
  return (
    <div className="w-[770px] min-h-[180px] p-6 border-2 rounded-[4px] text-base text-[#c2c2c6] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <figure className="w-[44px] h-[44px] mr-4 bg-[#c2c2c6] rounded-full border-2">
            <img src="" alt="" />
          </figure>
          <div>
            <h1 className="text-xl text-[#79757c] font-bold">
              {props.title}
            </h1>
            <h3>{props.companyName}</h3>
          </div>
        </div>
        <h4 className="bg-green-100 px-3 py-1 text-green-500 rounded-2xl">Active</h4>
      </div>
      <div className="flex items-center justify-between">
        <h4>Applications</h4>
        <h4 className="text-black">45 / 100</h4>
      </div>

      {/* Progress bar desgin or component */}
      <div className="w-full bg-[#f0f8ff] h-4 rounded-lg overflow-hidden">
        <div className="bg-black h-4" style={{ width: "45%" }}></div>
      </div>
      <h4 className="flex items-center">
        <GiNetworkBars className="mr-2" />
        1200 views
      </h4>
    </div>
  );
};

export default JobCard2;
