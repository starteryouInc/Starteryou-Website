import AppSupport from "../components/JobPage/AppSupport";
import DiscoverFuture from "../components/JobPage/DiscoverFuture";
import IdealJob from "../components/JobPage/IdealJob";
import JobHero from "../components/JobPage/JobHero";
import Reviews from "../components/JobPage/Reviews";
import TailoredJob from "../components/JobPage/TailoredJob";

export default function JobPage() {
  return (
    <div>
      <JobHero />
      <TailoredJob />
      <IdealJob />
      <DiscoverFuture />
      <AppSupport />
      <Reviews />
    </div>
  );
}
