import BetterFuture from "../components/About/BetterFuture";
import HeroAbout from "../components/About/HeroAbout";
import OurMission from "../components/About/OurMission";
import OurVision from "../components/About/OurVision";
import Team from "../components/About/Team";
import TechTeam from "../components/About/TechTeam";
import Contact from "../components/Landing/Contact";
import InProgressPage from "../components/Common/InProgressPage";
import { ToastContainer } from "react-toastify";
export default function AboutPage() {
  const deployReady = true;
  return deployReady ? (
    <div>
      <ToastContainer />
      <HeroAbout />
      <BetterFuture />
      <OurMission />
      <OurVision />
      <Team />
      <TechTeam />
      <Contact />
    </div>
  ) : (
    <InProgressPage />
  );
}
