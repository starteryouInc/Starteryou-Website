import { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { IoBagHandleSharp } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import Navbar from "../components/Common/Navbar";

/**
 * CompanyDashboard component - Displays the company dashboard page.
 * Redirects to Employer SignUp if the user is not authenticated.
 *
 * @returns {JSX.Element} The CompanyDashboard component.
 */
const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const token = user?.token;
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue...");
      navigate("/EmpSignUp");
    }
  }, [token, navigate]);

  return (
    <>
      <Navbar isEduHero={true} />
      <div className="pt-[100px] md:pt-[120px] flex flex-col items-center bg-white min-h-screen">
        {/* Navigation */}
        <nav className="w-full max-w-[1160px] py-4 flex items-center justify-between border-b border-gray-300 px-4 md:px-0">
          <ul className="flex items-center space-x-6 md:space-x-8">
            <li className="text-2xl text-[#7950F2] font-bold">Job Portal</li>

            {/* Profile Link */}
            <li className="text-[16px]">
              <Link
                to="/companyDashboard/"
                className={`flex items-center px-3 py-2 rounded-md transition duration-300 ${
                  location.pathname === "/companyDashboard/"
                    ? "border-b-4 border-[#7950F2] text-[#7950F2] font-semibold"
                    : "text-gray-700 hover:text-[#7950F2] hover:border-b-4 hover:border-[#7950F2]"
                }`}
              >
                <FaUserCircle className="mr-2 text-lg" />
                Profile
              </Link>
            </li>

            {/* Posted Jobs Link */}
            <li className="text-[16px]">
              <Link
                to="/companyDashboard/postedJobs"
                className={`flex items-center px-3 py-2 rounded-md transition duration-300 ${
                  location.pathname === "/companyDashboard/postedJobs"
                    ? "border-b-4 border-[#7950F2] text-[#7950F2] font-semibold"
                    : "text-gray-700 hover:text-[#7950F2] hover:border-b-4 hover:border-[#7950F2]"
                }`}
              >
                <IoBagHandleSharp className="mr-2 text-lg" />
                Posted Jobs
              </Link>
            </li>
          </ul>

          {/* Notification Icon */}
          <button
            className="relative p-2 text-gray-600 hover:text-[#7950F2] transition "
            disabled
          >
            <BsBell className="text-2xl" />
            {/* Optional notification dot */}
            {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
          </button>
        </nav>

        {/* Page Content */}
        <div className="w-full max-w-[1160px] px-4 md:px-0">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default CompanyDashboard;
