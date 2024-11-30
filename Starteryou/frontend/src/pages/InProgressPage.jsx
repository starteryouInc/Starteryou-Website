import React from "react";

const InProgressPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        {/* Title */}
        <h1 className="text-4xl font-bold text-blue-600 mb-4 font-sans">
          Page Under Construction
        </h1>

        {/* Description */}
        <p className="text-gray-700 text-lg mb-6">
          We’re working hard to bring this page to life. Please check back soon!
        </p>

        {/* Animation */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            aria-label="Back to Home"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default InProgressPage;
