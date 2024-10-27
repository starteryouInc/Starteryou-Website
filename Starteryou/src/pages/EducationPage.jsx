import ComprehensiveFeatures from "../components/Education/ComprehensiveFeatures";
import EduHero from "../components/Education/EduHero";
import OurInsight from "../components/Education/OurInsight";
import StartJourney from "../components/Education/StartJourney";
import Testimonials from "../components/Education/Testimonials";
import UnlockPotential from "../components/Education/UnlockPotential";
import YourJourney from "../components/Education/YourJourney";

export default function EducationPage() {
  return (
    <div>
      <EduHero />
      <YourJourney />
      <ComprehensiveFeatures />
      <UnlockPotential />
      <OurInsight />
      <StartJourney />
      <Testimonials />
    </div>
  );
}
