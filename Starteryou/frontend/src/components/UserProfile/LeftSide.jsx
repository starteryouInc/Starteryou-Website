import React from "react";
import "./styles/LeftSide.css";
import Flag from "/UserProfile/Flag.svg";
import EditPen from "/UserProfile/EditPen.svg";
import WhiteEditPen from "/UserProfile/WhiteEditPen.svg";
import GreenTick from "/UserProfile/GreenTick.svg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  PiBuildingOfficeLight,
  PiBagSimpleFill,
  PiWarningCircleFill,
} from "react-icons/pi";
import {
  IoLogoLinkedin,
  IoLogoInstagram,
  IoLogoTwitter,
  IoMailOutline,
} from "react-icons/io5";

const LeftSide = () => {
  return (
    <>
      <section className="left md:w-[560px] lg:w-[660px] xl:w-[460px]">
        {/* Profile Card */}
        <div className="profile-card">
          <p className="purple-section">
            <img src={WhiteEditPen} alt="edit btn" />
          </p>
          <div className="profile-card-sub space-y-10">
            {/* Personal Details */}
            <ul className="first-list flex flex-col items-center space-y-2">
              <li>
                <FaRegCircleUser className="text-[60px] text-white bg-[#e7e6e9] rounded-full" />
              </li>
              <li>
                <img src={Flag} alt="" />
              </li>
              <li className="text-[24px] font-semibold uppercase">
                John Oliver
              </li>
              <li>UI / UX Designer</li>
              <li className="line-style"></li>
              <li className="flex items-center">
                <MdLocationOn className="icon-style mr-2" />
                New York
              </li>
            </ul>

            {/* Contact Info */}
            <ul className="space-y-4 secondary-text-color">
              {[
                { icon: PiBuildingOfficeLight, text: "ABCDEF" },
                { icon: PiBagSimpleFill, text: "Exp: 4 Months" },
                { icon: FaPhoneAlt, text: "+91 1234567890", editable: true },
                { icon: IoMailOutline, text: "xyz@gmail.com", editable: true },
              ].map(({ icon: Icon, text, editable }, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <h3 className="flex items-center">
                    <Icon className="icon-style mr-4" />
                    {text}
                  </h3>
                  {editable && (
                    <div className="flex items-center space-x-4">
                      <img src={EditPen} alt="Edit" />
                      <img src={GreenTick} alt="Verified" />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Profile Completion */}
            <div className="profile-completion space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-semibold">
                  95% Profile Complete
                </h2>
                <PiWarningCircleFill className="icon-style text-[#6a54df]" />
              </div>
              <h4 className="secondary-text-color">
                Recruiters Notice you from 70%
              </h4>
              <label>
                0%
                <input type="range" name="" id="" className="py-6" />
                100%
              </label>
              <h2 className="p-5 flex justify-between bg-[#f7f2fa] rounded-[18px]">
                <span>Profile Picture</span>
                <span className="text-[#6a54df]">Add 5%</span>
              </h2>
            </div>

            <h2 className="text-center secondary-text-color text-[18px] font-semibold">
              Updated on : 29 November 2024
            </h2>
          </div>
        </div>

        {/* Availability Section */}
        <div className="availability-section flex justify-between items-center">
          <h2>Are you available to join immediately</h2>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        {/* Social Media Links */}
        <div className="social-media-links-section space-y-4">
          <div className="social-media-title">
            <h2>Social Presence</h2>
            <h4 className="text-[#6a54df] font-semibold">+ Add</h4>
          </div>
          <ul className="space-y-4 secondary-text-color">
            <li className="social-media-list">
              <h3>Linked in</h3>
              <IoLogoLinkedin className="icon-style text-[#0a66c2]" />
            </li>
            <li className="social-media-list">
              <h3>Instagram</h3>
              <IoLogoInstagram className="icon-style bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#962fbf] text-white rounded-lg" />
            </li>
            <li className="social-media-list">
              <h3>Twitter</h3>
              <IoLogoTwitter className="icon-style text-[#1da1f2]" />
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default LeftSide;
