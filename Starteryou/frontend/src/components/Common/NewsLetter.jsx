import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_CONFIG } from "@config/api";

/**
 * `NewsLetter` Component
 *
 * A newsletter subscription form that allows users to enter their name and email address.
 * It validates the inputs and submits them to the backend.
 * Displays toast notifications for success, errors, and warnings.
 *
 * @component
 * @returns {JSX.Element} The `NewsLetter` component.
 */
const NewsLetter = () => {
  /**
   * Form data state containing user inputs.
   * @type {[Object, Function]} formData - The user input state.
   * @property {string} name - The user's name.
   * @property {string} email - The user's email.
   */
  const [formData, setFormData] = useState({ name: "", email: "" });

  /**
   * Loading state to manage the submit button state.
   * @type {[boolean, Function]} loading - True if the form is submitting, false otherwise.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Handles input changes in the form fields.
   * Updates the corresponding state values.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission.
   * Validates user inputs before sending a POST request to the backend.
   * Displays toast notifications based on success or failure.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email) {
      toast.error("Both name and email are required.");
      setLoading(false);
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      // Send POST request to the backend API
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.newsletterApi}`,
        formData
      );

      if (response.data.message === "Email is already subscribed.") {
        toast.warning("Email is already subscribed.");
      } else {
        toast.success("Subscription successful!");
        setFormData({ name: "", email: "" }); // Reset form fields
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#F8FAFC] p-6 w-full">
      {/* Toast Notification Container */}
      <ToastContainer />

      <div className="relative overflow-hidden mx-auto my-12 p-12 lg:p-0 bg-[#6a54df] text-white flex flex-col justify-center items-center rounded-[18px] space-y-4 lg:w-[1166px] lg:h-[266px]">
        {/* Decorative circles for styling */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute -top-20 -left-14"></div>
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute -bottom-20 -right-14"></div>

        {/* Newsletter Heading */}
        <h1 className="text-center text-[38px] font-semibold leading-10">
          Subscribe to our newsletter
        </h1>

        {/* Subscription Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-3"
        >
          {/* Name Input Field */}
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email Input Field */}
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8"
            type="text"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="subscribe-now-btn bg-[#D9502E] rounded-md py-4 px-8"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
