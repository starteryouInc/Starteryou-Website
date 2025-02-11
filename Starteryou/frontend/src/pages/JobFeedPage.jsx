import React, { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";
import PenSvg from "/JobFeedPage/Pen.svg";
import FilterButtons from "../components/JobFeedPage/FilterButtons";
import "./styles/JobFeedPage.css";
import JobCard from "../components/JobFeedPage/JobCard";
import JobDetailCard from "../components/JobFeedPage/JobDetailCard";

const JobFeedPage = () => {
  const companyDummyData = [
    {
      id: 1,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle:
        "Infosys is Hiring for Senior Process Executive - HR (H2R-Employee Life Cycle)",
      compName: "Infosys BPM",
      experience: "0 - 1 Years",
      jobLocation: "Bengaluru / Bangalore, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
    {
      id: 2,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle: "Software Engineer I - Google",
      compName: "Google",
      experience: "0 - 1 Years",
      jobLocation: "Mumbai, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
    {
      id: 3,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle: "Technical Support Engineer",
      compName: "Amazon",
      experience: "0 - 1 Years",
      jobLocation: "Delhi / Noida, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
    {
      id: 4,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle: "HR Manager",
      compName: "Accenture",
      experience: "0 - 1 Years",
      jobLocation: "Delhi / Noida, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
    {
      id: 5,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle: "UX / UI Designer",
      compName: "Youtube Studios",
      experience: "0 - 1 Years",
      jobLocation: "Delhi / Noida, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
    {
      id: 6,
      compImgSrc: "/JobFeedPage/CompanyLogo.svg",
      jobTitle:
        "Infosys is Hiring for Senior Process Executive - HR (H2R-Employee Life Cycle)",
      compName: "Infosys BPM",
      experience: "0 - 1 Years",
      jobLocation: "Delhi / Noida, India",
      datePosted: "2 Days ago",
      jobType: "Permanent Job",
      jobDescription:
        "Minimum 2 year of experience in Non-IT & IT Recruitment with strong understanding of multiple IT and NON-IT technologies and market trend Good experience in sourcing profiles from job portals (Naukri/ Monster/Indeed), LinkedIn, internet search engines and other websites Hands-on experience in sourcing active and passive candidates using multiple recruiting tools Excellent written and verbal communication skills with the ability to quickly build rapport with the candidates and colleague Have the ability to multitask and meet aggressive recruitment targets within defined timelines Good experience in MS Office tools Excel, PowerPoint, Word, Outlook etc. Will have to do analysis on all recruitment related reports and publish them as per agreed timelines Coordination between Internal HR SPOC and candidates on offers, joining and inductions related activities",
    },
  ];

  const [jobID, setJobID] = useState(1);
  const [singleJob, setSingleJob] = useState(
    companyDummyData.find((job) => job.id === jobID)
  );
  const [detailCardPop, setDetailCardPop] = useState(false);

  // Update `singleJob` whenever `jobID` changes
  useEffect(() => {
    const foundJob = companyDummyData.find((job) => job.id === jobID);
    setSingleJob(foundJob);
  }, [jobID]);

  // Calculating the window size for mobile responsiveness of the Detailed Card Component
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <li>Recommended</li>
            <li>Applied</li>
            <li>Saved Network Jobs</li>
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
              {companyDummyData.map((e) => {
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      setJobID(e.id), setDetailCardPop(true);
                    }}
                    className={`transition-shadow duration-300 ${
                      jobID === e.id
                        ? "border border-[#8d00ff] rounded-[5px]"
                        : ""
                    }`}
                  >
                    <JobCard
                      companyLogo={e.compImgSrc}
                      jobTitle={e.jobTitle}
                      companyName={e.compName}
                      experienceReq={e.experience}
                      location={e.jobLocation}
                      datePosted={e.datePosted}
                    />
                  </div>
                );
              })}
            </div>
            <div className="job-details hidden md:block">
              {!isMobile && (
                <JobDetailCard
                  jobDetails={singleJob}
                  onClose={() => setDetailCardPop(false)}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFeedPage;
