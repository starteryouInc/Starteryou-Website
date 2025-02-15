import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Common/Navbar";
import PenSvg from "/JobFeedPage/Pen.svg";
import FilterButtons from "../components/JobFeedPage/FilterButtons";
import "./styles/JobFeedPage.css";
import JobCard from "../components/JobFeedPage/JobCard";
import JobDetailCard from "../components/JobFeedPage/JobDetailCard";
// import ApplyJobCard from "../components/JobFeedPage/ApplyJobCard";
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

  /**
   * Fetches job listings from the server.
   *
   * @async
   * @function getJobs
   * @returns {Promise<void>} No return value; updates state with job data.
   *
   * @throws {Error} Displays an error toast if the user is not authenticated or if the request fails.
   *
   * @description
   * - Checks if the user is authenticated; if not, shows an error toast and redirects to login.
   * - Sets the loading state to `true` before making the request.
   * - Sends a request to fetch job listings.
   * - If successful, updates the job data state.
   * - If an error occurs, displays an error toast.
   * - Finally, sets the loading state to `false` after the request completes.
   *
   * @dependency useCallback - Memoizes the function to prevent unnecessary re-creations.
   */

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
      // toast.success(data.msg);
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

  /**
   * Fetches job details by job ID.
   *
   * @async
   * @function getJobById
   * @param {string} jobID - The unique identifier of the job to retrieve.
   * @returns {Promise<void>} No return value; updates state with job details.
   *
   * @throws {Error} Displays an error toast if the request fails.
   *
   * @description
   * - Checks if the user is authenticated; if not, exits early.
   * - Sends a request to fetch job details using the provided job ID.
   * - If successful, updates the state with the retrieved job data.
   * - If an error occurs, displays an error toast.
   */

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

  /**
   * Fetches the list of jobs the user has applied to.
   *
   * @async
   * @function getAppliedJobs
   * @returns {Promise<void>} No return value; updates state with applied job details.
   *
   * @throws {Error} Displays an error toast if the request fails.
   *
   * @description
   * - Checks if the user is authenticated; if not, exits early.
   * - Sets the loading state to `true` before making the request.
   * - Fetches the list of applied jobs for the authenticated user.
   * - For each application, retrieves job details using the job ID.
   * - Filters out any jobs that are not found (404 errors).
   * - Updates the state with the list of successfully retrieved job details.
   * - If an error occurs, displays an error toast.
   * - Finally, sets the loading state to `false` after the request completes.
   */

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
          try {
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
          } catch (error) {
            if (error.response?.status === 404) {
              console.warn(`Job ${application.jobId} not found, skipping it.`);
              return null;
            }
            throw error;
          }
        })
      );

      setAppliedJobs(appliedJobs.filter((job) => job !== null));
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the list of jobs the user has saved/bookmarked.
   *
   * @async
   * @function getSavedJobs
   * @returns {Promise<void>} No return value; updates state with saved job details.
   *
   * @throws {Error} Displays an error toast if the request fails.
   *
   * @description
   * - Checks if the user is authenticated; if not, exits early.
   * - Sets the loading state to `true` before making the request.
   * - Fetches the list of saved/bookmarked jobs for the authenticated user.
   * - For each saved job, retrieves detailed job information using the job ID.
   * - Filters out jobs that are not found (404 errors).
   * - Updates the state with the list of successfully retrieved job details.
   * - If an error occurs, displays an error toast.
   * - Finally, sets the loading state to `false` after the request completes.
   */

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
          try {
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
          } catch (error) {
            if (error.response?.status === 404) {
              console.warn(`Job ${saved.jobId} not found, skipping it.`);
              return null;
            }
            throw error;
          }
        })
      );
      setSavedJobs(savedJobs.filter((job) => job !== null));
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  /**
 * Saves (bookmarks) a job for the authenticated user.
 * 
 * @async
 * @function saveJob
 * @param {string} jobId - The unique identifier of the job to be bookmarked.
 * @returns {Promise<void>} No return value; updates the saved jobs list.
 * 
 * @throws {Error} Displays an error toast if the request fails.
 * 
 * @description
 * - Checks if the user is authenticated; if not, exits early.
 * - Sends a request to bookmark the specified job.
 * - If successful, displays a success toast and refreshes the saved jobs list.
 * - If an error occurs, displays an error toast with a relevant message.
 */

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
            {[
              { label: "Recommended", count: jobData.length },
              ...(role !== "employer"
                ? [
                    { label: "Applied", count: appliedJobs.length },
                    { label: "Saved", count: savedJobs.length },
                  ]
                : []),
            ].map(({ label, count }) => (
              <li
                key={label}
                className={`cursor-pointer ${
                  selectedTab === label ? "text-[#8d00ff] font-bold" : ""
                }`}
                onClick={() => handleTabClick(label)}
              >
                {label} ({count})
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
