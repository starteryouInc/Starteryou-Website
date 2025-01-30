import React, {useState} from 'react'

const ApplyJobCard = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whyHire: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
      };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 mx-4 border-2 rounded-lg w-full max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">First name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Last name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Why should we hire you?</label>
        <textarea
          name="whyHire"
          value={formData.whyHire}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="privacyPolicy"
            required
            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-600">You agree to our friendly privacy policy.</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Apply now!
      </button>
    </form>
  )
}

export default ApplyJobCard