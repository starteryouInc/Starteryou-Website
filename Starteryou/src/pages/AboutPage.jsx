import BetterFuture from "../components/About/BetterFuture";
import HeroAbout from "../components/About/HeroAbout";
import OurMission from "../components/About/OurMission";
import OurVision from "../components/About/OurVision";
import Team from "../components/About/Team";
import TechTeam from "../components/About/TechTeam";
import Contact from "../components/Landing/Contact";

export default function AboutPage() {
  return (
    <div>
      <HeroAbout />
      <BetterFuture />
      <OurMission />
      <OurVision />
      <Team />
      <TechTeam />
      <Contact />
    </div>
  );
}
