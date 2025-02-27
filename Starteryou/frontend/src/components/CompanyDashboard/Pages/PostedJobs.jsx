import { useEffect, useState } from "react";
import JobCard2 from "../JobCard2";
import JobDetailedCard2 from "../JobDetailedCard2";
import { API_CONFIG } from "../../../config/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import QuickTips from "../QuickTips";
import NeedHelp from "../NeedHelp";
import CreateJobCard from "../../JobFeedPage/CreateJobCard";
import { IoAddOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";

/**
 * PostedJobs Component
 * Displays a list of jobs posted by the employer and provides functionalities to view, delete, and create jobs.
 *
 * @component
 * @returns {JSX.Element} The PostedJobs component.
 */
const PostedJobs = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [showDetailedCard, setShowDetailedCard] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openCreateJobCard, setOpenCreateJobCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = user?.token;

  /**
   * Fetches the jobs posted by the employer.
   *
   * @async
   * @function getPostedJobs
   * @returns {Promise<void>} A promise that resolves when jobs are fetched.
   */
  const getPostedJobs = async () => {
    if (!token) {
      toast.error("Pls login to continue...");
      navigate("/EmpSignUp");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getPostedJobs}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPostedJobs(data.data);
      // toast.success(data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a job posting.
   *
   * @async
   * @function deleteJob
   * @param {string} jobId - The ID of the job to be deleted.
   * @returns {Promise<void>} A promise that resolves when the job is deleted.
   */
  const deleteJob = async (jobId) => {
    const isConfirmed = confirm("Are you sure you want to close this job");
    if (!isConfirmed) return;
    try {
      const { data } = await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.deleteJob(jobId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.msg);
      setShowDetailedCard(false);
      getPostedJobs();
    } catch (error) {
      toast.error(error.response?.data?.msg);
    }
  };

  useEffect(() => {
    getPostedJobs();
  }, []);

  return (
    <div className="mb-10">
      <div className="main-container flex flex-col md:flex-row items-start md:space-x-6 py-6">
        {/* Left Section - Jobs List */}
        <div className="left-section w-[770px]">
          {/* Header */}
          <div className="pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            <button
              onClick={() => setOpenCreateJobCard(true)}
              className="flex items-center justify-between py-2 px-4 bg-[#8176ff] text-white rounded-lg hover:bg-purple-500"
            >
              <IoAddOutline className="mr-2 text-xl" /> <span>Post a Job</span>
            </button>
          </div>
          {/* Analytics */}
          <div className="company-detail-container mb-6 w-full h-[350px] flex flex-col items-center justify-center border rounded-lg bg-gray-100 text-gray-600 ">
            <BsGraphUp className="text-6xl mb-3 text-gray-500" />
            <span className="text-lg font-medium">Analytics Coming Soon</span>
          </div>

          <div className="posted-job-list space-y-4 ">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#7950F2] rounded-full animate-spin"></div>
                <span className="text-xl font-bold">Loading...</span>
              </div>
            ) : postedJobs.length !== 0 ? (
              postedJobs.map((e) => {
                return (
                  <div
                    key={e._id}
                    onClick={() => {
                      setSelectedJob(e);
                      setShowDetailedCard(true);
                    }}
                    className="cursor-pointer"
                  >
                    <JobCard2 title={e.title} companyName={e.companyName} />
                  </div>
                );
              })
            ) : (
              <p> </p>
            )}
            {showDetailedCard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative bg-white rounded-lg shadow-lg w-[100%] h-[100%]">
                  <button
                    onClick={() => setShowDetailedCard(false)}
                    className="absolute top-4 right-4 bg-red-500 text-white px-3 py-3 rounded-full"
                  >
                    <IoMdClose className="text-white text-lg" />
                  </button>
                  <JobDetailedCard2
                    job={selectedJob}
                    getPostedJobs={getPostedJobs}
                    deleteJobFunction={deleteJob}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right-section space-y-8">
          <QuickTips />
          <NeedHelp />
        </div>
      </div>
      {openCreateJobCard && (
        <div
          className="pop-up py-3 fixed inset-0 bg-black bg-opacity-50 flex items-start
        justify-center z-50 overflow-hidden "
        >
          <CreateJobCard
            fetchPostedJobs={getPostedJobs}
            closeCreateJobCard={() => setOpenCreateJobCard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
