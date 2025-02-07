import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsLetter = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email) {
      toast.error("Both name and email are required.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      // Send POST request to your backend
      const response = await axios.post(
        "http://localhost:3000/api/newsletter/subscribe",
        formData
      );

      if (response.data.message === "Email is already subscribed.") {
        toast.warning("Email is already subscribed.");
      } else {
        toast.success("Subscription successful!");
        setFormData({ name: "", email: "" }); // Reset form
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
        {/* Two circles for the top and bottom design */}
        <div className="h-40 w-40 bg-transparent border-4 border-[#8574e4] rounded-full absolute -top-20 -left-14"></div>
        <div className="h-40 w-40 bg-transparent border-4 border-white rounded-full absolute -bottom-20 -right-14"></div>

        <h1 className="text-center text-[38px] font-semibold leading-10">
          Subscribe to our newsletter
        </h1>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-3"
        >
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="bg-transparent border border-[#d4d4d8] rounded-md outline-none py-4 px-8"
            type="text"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
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
