import React from "react";
import "../styles/RightSide.css";
import EditPen from "/UserProfile/EditPen.svg";
import { GrCertificate } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import { API_CONFIG } from "../../../config/api";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

const CoursCertiCard = ({
  openCertificationForm,
  data,
  getProfileFieldData,
}) => {
  const { user } = useUserContext();
  const token = user?.token;

  function formatExpiryDate(expiryDate) {
    const options = { year: "numeric", month: "long" };
    const formattedDate = new Date(expiryDate).toLocaleDateString(
      "en-US",
      options
    );
    return `Validity - ${formattedDate}`;
  }

  const handleDeleteData = async (subDocId) => {
    const userId = user?.authenticatedUser?._id;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteCertificate(
          userId,
          subDocId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      getProfileFieldData("");
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  return (
    <div
      className={`license-display-card ${
        data.length !== 0 ? "space-y-4" : "space-y-0"
      } `}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Courses and Certification</h2>
        <button
          onClick={openCertificationForm}
          className="text-[#6a54df] font-semibold"
        >
          + Add
        </button>
      </div>
      <section className="flex flex-col items-start justify-between space-y-4">
        {data.length !== 0
          ? data.map((e) => (
              <div
                key={e._id}
                className="flex justify-between items-start w-full"
              >
                <div className="flex items-start">
                  {/* Icon */}
                  <GrCertificate className="icon-style mr-4" />

                  {/* Details */}
                  <div className="space-y-2">
                    <h1 className="text-xl">{e.title}</h1>
                    <h2 className="text-lg font-semibold">{e.issuedBy}</h2>
                    {e.expiryDate && (
                      <h5 className="text-lg text-[#777585]">
                        {formatExpiryDate(e.expiryDate)}
                      </h5>
                    )}
                    {e.certificateURL ? (
                      <h5 className="text-lg">
                        URL / Credentials: {e.certificateURL}
                      </h5>
                    ) : (
                      " "
                    )}
                  </div>
                </div>

                {/* Edit Icon */}
                <div className="icons flex items-center space-x-2">
                  <img
                    src={EditPen}
                    alt="Edit Education details"
                    className="cursor-pointer ml-auto"
                  />
                  <MdOutlineDelete
                    className="text-[#6a54df] cursor-pointer"
                    style={{ width: "22px", height: "22px" }}
                    onClick={() => handleDeleteData(e._id)}
                  />
                </div>
              </div>
            ))
          : ""}
      </section>
    </div>
  );
};

export default CoursCertiCard;
