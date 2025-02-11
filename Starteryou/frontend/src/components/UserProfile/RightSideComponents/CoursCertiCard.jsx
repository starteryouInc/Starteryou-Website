import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { GrCertificate } from "react-icons/gr";

const CoursCertiCard = ({ openCertificationForm }) => {
  const CourAndCertiList = [
    {
        ID: 1,
        name: "Google's UX Design Course",
        issuedBy: "Google",
        expiryDate: "Lifetime",
        //   credentialID: " ",
      },{
        ID: 2,
        name: "Google's UX Design Course",
        issuedBy: "Google",
        expiryDate: "Lifetime",
        //   credentialID: " ",
      },
  ];
  return (
    <div
      className={`license-display-card ${
        CourAndCertiList.length !== 0 ? "space-y-4" : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Courses and Certification</h2>
        <button onClick={openCertificationForm} className="text-[#6a54df] font-semibold">+ Add</button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {CourAndCertiList.length !== 0
          ? CourAndCertiList.map((e) => (
            <div key={e.ID} className="flex items-start w-full">
              {/* Icon */}
              <GrCertificate className="icon-style mr-4" />

              {/* Details */}
              <div className="space-y-2">
                <h1 className="text-xl">{e.name}</h1>
                <h2 className="text-lg font-semibold">{e.issuedBy}</h2>
                <h5 className="text-lg text-[#777585]">{e.expiryDate}</h5>
                {e.credentialID ? (
                  <h5 className="text-lg">Credentials: {e.credentialID}</h5>
                ) : (
                  " "
                )}
              </div>

            {/* Edit Icon */}
            <img
                  src={EditPen}
                  alt="Edit Experience"
                  className="cursor-pointer ml-auto"
                />
          </div>
            ))
          : ""}
      </section>
    </div>
  );
};

export default CoursCertiCard;
