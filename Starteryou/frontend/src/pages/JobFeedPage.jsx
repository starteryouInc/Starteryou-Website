import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Common/Navbar";
import PenSvg from "/JobFeedPage/Pen.svg";
import FilterButtons from "../components/JobFeedPage/FilterButtons";
import "./styles/JobFeedPage.css";
import JobCard from "../components/JobFeedPage/JobCard";
import JobDetailCard from "../components/JobFeedPage/JobDetailCard";
import ApplyJobCard from "../components/JobFeedPage/ApplyJobCard";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/api";
import { toast } from "react-toastify";
import axios from "axios";

const JobFeedPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [jobData, setJobData] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [singleJob, setSingleJob] = useState([]);
  const [detailCardPop, setDetailCardPop] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Recommended");
  const [loading, setLoading] = useState(false);

  const token = user?.token;
  const role = user?.authenticatedUser?.role;

  const getJobs = useCallback(async () => {
    if (!user?.token) {
      toast.error("Pls login to continue...");
      navigate("/UserLogin");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getJobs}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobData(data.data);
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]); // Using `useCallback` to memoize the function

  const [jobID, setJobID] = useState("");

  useEffect(() => {
    if (jobData.length > 0) {
      setJobID(jobData[0]._id); // Setting initial jobID only after jobData is populated
    }
  }, [jobData]);

  const getJobById = async (jobID) => {
    if (!user?.token) return;
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getJobById(jobID)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleJob(data.data);
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  const getAppliedJobs = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getAppliedJobs}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch job details for each jobId in the applications list
      const appliedJobs = await Promise.all(
        data.applications.map(async (application) => {
          const jobResponse = await axios.get(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getJobById(
              application.jobId
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return jobResponse.data.data;
        })
      );

      setAppliedJobs(appliedJobs);
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  const getSavedJobs = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getBookmarkedJobs}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const savedJobs = await Promise.all(
        data.bookmarked.map(async (saved) => {
          const jobResponse = await axios.get(
            `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getJobById(
              saved.jobId
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return jobResponse.data.data;
        })
      );
      setSavedJobs(savedJobs);
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobId) => {
    const token = user?.token;
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.bookmarkJob(jobId)}`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Job is bookmarked");
      getSavedJobs();
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setDetailCardPop(false);
    setJobID("");
    if (tab === "Applied") {
      getAppliedJobs();
    } else if (tab === "Saved") {
      getSavedJobs();
    }
  };

  // Calculating the window size for mobile responsiveness of the Detailed Card Component
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredJobs =
    selectedTab === "Recommended"
      ? jobData
      : selectedTab === "Applied"
      ? appliedJobs
      : savedJobs;

  return (
    <div>
      <Navbar isEduHero={true} />
      <div className="jobfeedpage-container pt-[100px] xl:px-[130px] 2xl:px-[190px]">
        <section className="section-one">
          <h2>Job Feed</h2>
          <h2 className="flex text-[#8d00ff]">
            Job Preferences <img src={PenSvg} alt="pen icon" className="ml-2" />
          </h2>
        </section>
        <section className="section-two">
          <ul className="flex justify-between md:justify-start md:space-x-4">
            {["Recommended", ...(role !== "employer" ? ["Applied", "Saved"] : [])].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer ${
                  selectedTab === tab ? "text-[#8d00ff] font-bold" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </section>
        <section className="section-three space-y-[14px]">
          <h5 className="text-[#bcbcbc] text-md font-semibold leading-[10px] uppercase">
            Job based on
          </h5>
          <div className="filterBtns flex space-x-2">
            <FilterButtons filterName="Preferences" />
            <FilterButtons filterName="Applied History" />
            <FilterButtons filterName="Similar Applicants" />
          </div>
          <div className="job-listing-container flex justify-center md:space-x-4">
            <div className="job-lists space-y-4 md:h-[1235px] lg:h-[995px] overflow-y-scroll">
              {loading ? (
                <h1 className="mt-20 text-center text-xl font-bold">
                  Loading wait...
                </h1>
              ) : filteredJobs.length !== 0 ? (
                filteredJobs.map((e) => {
                  return (
                    <div
                      key={e._id}
                      onClick={() => {
                        setJobID(e._id),
                          getJobById(e._id),
                          setDetailCardPop(true);
                      }}
                      className={`transition-shadow duration-300 ${
                        jobID === e._id
                          ? "border border-[#8d00ff] rounded-[5px]"
                          : ""
                      }`}
                    >
                      <JobCard
                        companyLogo={e.compImgSrc}
                        jobTitle={e.title}
                        companyName={e.companyName}
                        experienceReq={e.experienceLevel}
                        location={e.location}
                        datePosted={e.createdAt}
                      />
                    </div>
                  );
                })
              ) : (
                <p>not data</p>
              )}
            </div>
            <div className="job-details hidden md:block">
              {detailCardPop && singleJob && (
                <JobDetailCard
                  jobDetails={singleJob}
                  onClose={() => setDetailCardPop(false)}
                  savedJob={saveJob}
                  // openApplyJob={() => setOpenApplyJob(true)}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {detailCardPop && isMobile && (
        <div className="mobile-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-4 w-[100%] max-h-[90%] overflow-y-auto">
            <JobDetailCard
              jobDetails={singleJob}
              onClose={() => setDetailCardPop(false)}
              savedJob={saveJob}
              // openApplyJob={() => setOpenApplyJob(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFeedPage;
