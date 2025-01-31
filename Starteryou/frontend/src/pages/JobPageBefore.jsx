import DiscoverPath from "../components/Job/BeforeSignup/DiscoverPath";
import HeroJobPortal from "../components/Job/BeforeSignup/HeroJobPortal";

import JobListing from "../components/Job/BeforeSignup/JobListing";
import LatestInsight from "../components/Job/BeforeSignup/LatestInsight";
import LaunchBanner from "../components/Job/BeforeSignup/LaunchBanner";
import PathStart from "../components/Job/BeforeSignup/PathStart";
import UnlockPotential from "../components/Job/BeforeSignup/UnlockPotential";

export default function JobPageBefore() {
  return (
    <div>
      <HeroJobPortal />
      <JobListing />
      <DiscoverPath />
      <UnlockPotential />
      <PathStart />
      <LaunchBanner />
      <LatestInsight />
    </div>
  );
}
