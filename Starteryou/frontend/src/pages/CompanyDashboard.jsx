import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { IoBagHandleSharp } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Common/Navbar";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const token = user?.token;
  useEffect(() => {
    if (!token) {
      toast.error("Pls login to continue...");
      navigate("/EmpSignUp");
    }
  }, []);

  return (
    <>
      <Navbar isEduHero={true} />
      <div className="pt-[100px] flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-[1160px] py-4 flex items-center justify-between">
          <ul className="flex items-center space-x-8">
            <li className="text-xl text-[#9b86f6] font-bold">Job Portal</li>
            <li>
              <Link to="/companyDashboard/">Profile</Link>
            </li>
            <li className="text-[16px]">
              <Link
                to="/companyDashboard/postedJobs"
                className="flex items-center"
              >
                <IoBagHandleSharp className="mr-2" />
                Posted Jobs
              </Link>
            </li>
          </ul>
          <BsBell />
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default CompanyDashboard;
