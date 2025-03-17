import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Close icon
import CreateJobCard from "../JobFeedPage/CreateJobCard";

const EmployerPlan = ({ onClose }) => {
  const freeFeatures = [
    "Visible in search results",
    "Receive up to 20 applicants",
    "Job post lasts for 7 days",
    "Post a new free job every 7 days",
    "Notifications when candidates apply",
  ];

  const paidFeatures = [
    "Customizable posting duration",
    "Receive up to 200 applicants",
    "Job post lasts up to 8 weeks",
    "Highlighted to qualified candidates",
    "Notifications when candidates apply",
  ];

  const durationPrices = {
    1: 4,
    2: 7,
    3: 10,
    4: 14,
    5: 18,
    6: 23,
    7: 28,
    8: 34,
  };
  const applicantPrices = {
    20: 4.85,
    40: 8.35,
    60: 10.85,
    80: 14.35,
    100: 19.85,
    125: 24.85,
    150: 30.85,
    175: 34.85,
    200: 38.85,
  };

  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedApplicants, setSelectedApplicants] = useState(20);
  const [openCreateJobCard, setOpenCreateJobCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFreePlanClick = async () => {
    const isEligible = await checkFreePlanEligibility();

    if (isEligible) {
      setOpenCreateJobCard(true);
    } else {
      setErrorMessage("No free job available, visit after some time");
    }
  };
  // Function to check if the user is eligible for a free job post
  const checkFreePlanEligibility = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/checkFreePlanEligibility"
        // http://localhost:3000/api/v1/jobportal/jobs/checkFreePlanEligibility
      );
      const data = await response.json();
      return data.isEligible; // Assuming API returns this info
    } catch (error) {
      console.error("Error checking free plan eligibility:", error);
      return false;
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-md shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-700">
          Choose Your Plan
        </h2>

        {/* Flexbox becomes vertical on small screens */}
        <div className="flex flex-col md:flex-row justify-between items-stretch space-y-6 md:space-y-0 md:space-x-6">
          {/* Free Plan Box */}
          <div className="border border-gray-200 p-4 sm:p-6 rounded-xl w-full md:w-1/2 flex flex-col cursor-pointer hover:bg-gray-50 transition duration-300 ease-in-out">
            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
              Free
            </h3>
            <p className="text-3xl md:text-4xl font-bold text-purple-500 mb-4 italic">
              $0
            </p>

            {/* Features */}
            <ul className="flex-grow space-y-3 mb-6">
              {freeFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="text-sm sm:text-base text-gray-600 flex items-center"
                >
                  <span className="text-blue-600 mr-2">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* Select Free Button */}
            <button
              onClick={handleFreePlanClick}
              className="w-full py-2 sm:py-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              Select Free
            </button>
            {errorMessage && <p>{errorMessage}</p>}
          </div>

          {/* Paid Plan Box (Recommended) */}
          <div className="relative border border-purple-500 p-4 sm:p-6 rounded-xl w-full md:w-1/2 flex flex-col cursor-pointer bg-purple-50 hover:bg-gray-50 transition duration-300 ease-in-out shadow-lg transform ">
            {/* Recommendation Badge */}
            <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
              Recommended
            </div>

            <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
              Paid
            </h3>
            <p className="text-xs sm:text-sm mb-4 text-gray-500">
              Custom pricing for your job post
            </p>

            {/* Dropdowns for Weeks and Applicants */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weeks
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-gray-700 mb-4"
              >
                {Object.keys(durationPrices).map((week) => (
                  <option key={week} value={week}>
                    {week}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Applicants
              </label>
              <select
                value={selectedApplicants}
                onChange={(e) => setSelectedApplicants(e.target.value)}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg text-gray-700"
              >
                {Object.keys(applicantPrices).map((applicant) => (
                  <option key={applicant} value={applicant}>
                    {applicant}
                  </option>
                ))}
              </select>
            </div>

            {/* Features */}
            <ul className="flex-grow space-y-3 mb-6">
              {paidFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="text-sm sm:text-base text-gray-600 flex items-center"
                >
                  <span className="text-blue-600 mr-2">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* Post Job Button */}
            <button className="w-full py-2 sm:py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition transform hover:scale-105 duration-300">
              Post Job
            </button>
          </div>
        </div>
      </div>
      {openCreateJobCard && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
        justify-center z-50 overflow-hidden "
        >
          <CreateJobCard
            fetchPostedJobs={getPostedJobs}
            closeCreateJobCard={() => setOpenCreateJobCard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EmployerPlan;
