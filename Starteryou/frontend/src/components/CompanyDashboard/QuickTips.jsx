import React from "react";
import { VscLightbulbSparkle } from "react-icons/vsc";

/**
 * QuickTips Component - Displays a list of tips to improve job postings.
 *
 * @component
 * @returns {JSX.Element} The QuickTips component.
 */
const QuickTips = () => {
  return (
    <div className="quick-tips w-[370px] h-[240px] px-4 border border-[#dedede] rounded-[4px] flex flex-col items-start justify-center space-y-4">
      <h2 className="flex items-center text-[18px] text-[#736F79] font-bold">
        <VscLightbulbSparkle className="mr-2 text-[#8e88ff]" />
        Quick Tips
      </h2>
      <ul className="space-y-2 text-[#9c98a0]">
        <li className="flex items-start">
          <span className="bg-[#f1efff] text-[#8e88ff] mr-2 h-5 w-5 rounded-full flex items-center justify-center">
            1
          </span>
          <span>Use action verbs in your job titles for better visibility</span>
        </li>
        <li className="flex items-start">
          <span className="bg-[#f1efff] text-[#8e88ff] mr-2 h-5 w-5 rounded-full flex items-center justify-center">
            2
          </span>
          <span>
            Include salary ranges to attract more qualified candidates
          </span>
        </li>
        <li className="flex items-start">
          <span className="bg-[#f1efff] text-[#8e88ff] mr-2 h-5 w-5 rounded-full flex items-center justify-center">
            3
          </span>
          <span>Add specific requirements to filter the right candidates</span>
        </li>
      </ul>
    </div>
  );
};

export default QuickTips;
