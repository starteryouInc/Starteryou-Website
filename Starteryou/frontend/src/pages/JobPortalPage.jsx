import DiscoverPath from "../components/JobPortal/DiscoverPath";
import HeroJobPortal from "../components/JobPortal/HeroJobPortal";

import JobListing from "../components/JobPortal/JobListing";
import LatestInsight from "../components/JobPortal/LatestInsight";
import LaunchBanner from "../components/JobPortal/LaunchBanner";
import PathStart from "../components/JobPortal/PathStart";
import UnlockPotential from "../components/JobPortal/UnlockPotential";

export default function JobPortalPage() {
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
