import React from "react";
import Navbar from "../components/Common/Navbar";
import LeftSide from "../components/UserProfile/LeftSide";
import RightSide from "../components/UserProfile/RightSide";

const UserProfile = () => {
  return (
    <div>
      <Navbar isEduHero={true} />
      <div className="profile-container pt-[100px] flex flex-col items-center xl:flex-row xl:items-start xl:justify-center">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
};

export default UserProfile;
