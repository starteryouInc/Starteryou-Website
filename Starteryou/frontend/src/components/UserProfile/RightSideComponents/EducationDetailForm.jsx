import React, { useState } from "react";

const EducationalDetailsForm = ({ openEducationForm }) => {
  const [formData, setFormData] = useState({
    qualification: "",
    specialization: "",
    institute: "",
    gradingSystem: "",
    marks: "",
    passingYear: "",
  });

  const [errors, setErrors] = useState({});

  const gradingOptions = ["Percentage", "CGPA", "GPA"];
  const marksOptions = ["85%", "90%", "9.0", "8.5"];
  const yearOptions = ["2023", "2022", "2021", "2020"];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.institute) newErrors.institute = "Institute is required";
    if (!formData.passingYear) newErrors.passingYear = "Passing Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted Successfully:", formData);
      alert("Educational Details Saved Successfully!");
      // API call or logic to save form data
    }
  };

  const handleCancel = () => {
    setFormData({
      qualification: "",
      specialization: "",
      institute: "",
      gradingSystem: "",
      marks: "",
      passingYear: "",
    });
    setErrors({});
    openEducationForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-4 bg-white p-8 border rounded-lg space-y-4 md:w-[560px]"
    >
      <h2 className="text-2xl font-semibold mb-4">Educational Details</h2>

      {/* Qualification */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Qualification <span className="text-red-500">*</span></label>
        <select
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.qualification ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Qualification</option>
          <option value="High School">High School</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
        </select>
        {errors.qualification && (
          <p className="text-red-500 text-sm">{errors.qualification}</p>
        )}
      </div>

      {/* Specialization */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Specialisation <span className="text-red-500">*</span></label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.specialization ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Specialisation</option>
          <option value="Science">Science</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
        </select>
        {errors.specialization && (
          <p className="text-red-500 text-sm">{errors.specialization}</p>
        )}
      </div>

      {/* Institute */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Institute <span className="text-red-500">*</span></label>
        <select
          name="institute"
          value={formData.institute}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.institute ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Institute</option>
          <option value="MIT">MIT</option>
          <option value="Harvard">Harvard</option>
          <option value="Stanford">Stanford</option>
        </select>
        {errors.institute && (
          <p className="text-red-500 text-sm">{errors.institute}</p>
        )}
      </div>

      {/* Grading System */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Grading System</label>
        <select
          name="gradingSystem"
          value={formData.gradingSystem}
          onChange={handleChange}
          className="w-full p-2 border rounded border-gray-300"
        >
          <option value="">Select Grading System</option>
          {gradingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Marks */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Marks</label>
        <select
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          className="w-full p-2 border rounded border-gray-300"
        >
          <option value="">Select Marks</option>
          {marksOptions.map((mark) => (
            <option key={mark} value={mark}>
              {mark}
            </option>
          ))}
        </select>
      </div>

      {/* Passing Year */}
      <div>
        <label className="block font-semibold text-[#777585] mb-2">Passing Year <span className="text-red-500">*</span></label>
        <select
          name="passingYear"
          value={formData.passingYear}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            errors.passingYear ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Passing Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.passingYear && (
          <p className="text-red-500 text-sm">{errors.passingYear}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="text-purple-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EducationalDetailsForm;
