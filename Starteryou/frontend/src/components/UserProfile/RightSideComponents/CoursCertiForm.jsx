import React, { useState } from "react";

const CoursCertiForm = ({ openCertificationForm }) => {
  const [certification, setCertification] = useState("");
  const [issuer, setIssuer] = useState("");
  const [doesNotExpire, setDoesNotExpire] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const handleSave = () => {
    const data = {
      certification,
      issuer,
      doesNotExpire,
      validity: doesNotExpire ? null : { year, month },
    };
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]">
      <h3 className="text-2xl font-semibold mb-4">Courses and Certification</h3>
      
      <label className="block font-semibold text-[#777585] mb-2">Certification <span className="text-red-500">*</span></label>
      <input
        type="text"
        placeholder="Enter your certificate"
        value={certification}
        onChange={(e) => setCertification(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">Issued By <span className="text-red-500">*</span></label>
      <input
        type="text"
        placeholder="Enter your certificate issuer"
        value={issuer}
        onChange={(e) => setIssuer(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={doesNotExpire}
          onChange={() => setDoesNotExpire(!doesNotExpire)}
          className="w-4 h-4 mr-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label className="block font-semibold">This credential does not expire</label>
      </div>

      {!doesNotExpire && (
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block font-semibold text-[#777585] mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Year</option>
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#777585] mb-2">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m, index) => (
                <option key={index} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button
          onClick={openCertificationForm}
          className="text-purple-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CoursCertiForm;
