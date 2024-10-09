import DiscoverPath from "../components/JobPortal/DiscoverPath";
import HeroJobPortal from "../components/JobPortal/HeroJobPortal";

import JobListing from "../components/JobPortal/JobListing";
import UnlockPotential from "../components/JobPortal/UnlockPotential";

export default function JobPortalPage() {
  return (
    <div>
      <HeroJobPortal />
      <JobListing />
      <DiscoverPath />
      <UnlockPotential />
    </div>
  );
}
