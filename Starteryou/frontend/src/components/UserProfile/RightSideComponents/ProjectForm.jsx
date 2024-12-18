import React, { useState } from "react";

const ProjectForm = ({ openProjectForm }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [details, setDetails] = useState("");

  const handleSave = () => {
    const data = { title, url, endDate: { year, month }, details };
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]">
      <h3 className="text-2xl font-semibold mb-4">Projects</h3>

      <label className="block font-semibold text-[#777585] mb-2">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter your title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">URL</label>
      <input
        type="text"
        placeholder="Enter your URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <label className="block font-semibold text-[#777585] mb-2">End Date</label>
      <div className="flex gap-4 mb-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Year</option>
          {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
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

      <label className="block font-semibold text-[#777585] mb-2">Details of Projects</label>
      <textarea
        placeholder="Enter your project detail"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        maxLength={1000}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      ></textarea>
      <p className="block font-medium mb-2">Max. 1000/1000 Characters</p>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
        <button
          onClick={openProjectForm}
          className="text-purple-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
