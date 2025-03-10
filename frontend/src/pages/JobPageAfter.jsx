import CareerOptions from "../components/Job/AfterSignup/CarrerOptions";
import ExcitingCareer from "../components/Job/AfterSignup/ExcitingCareer";
import ExploreJob from "../components/Job/AfterSignup/ExploreJob";
import JobHero from "../components/Job/AfterSignup/JobHero";
import Reviews from "../components/Job/AfterSignup/Reviews";

export default function JobPageAfter() {
  return (
    <div>
      <JobHero />
      <ExploreJob />
      <Reviews />
      <ExcitingCareer />
      <CareerOptions />
    </div>
  );
}
