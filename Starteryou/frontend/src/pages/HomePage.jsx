import Banner from "../components/Landing/Banner";
import BestBuddy from "../components/Landing/BestBuddy";
import BestJob from "../components/Landing/BestJob";
import BestJob2 from "../components/Landing/BestJob2";
import BestJob3 from "../components/Landing/BestJob3";
import BestJob4 from "../components/Landing/BestJob4";
import Blog from "../components/Landing/Blog";
import Collab from "../components/Landing/Collab";
import Contact from "../components/Landing/Contact";
import Hero from "../components/Landing/Hero";
// import Pricing from "../components/Landing/Pricing";
import UpcomingFeatures from "../components/Landing/UpcomingFeatures";
import InProgressPage from "../components/Common/InProgressPage";
export default function HomePage() {
  const deployReady = true;
  return deployReady ? (
    <div>
      <Hero />
      <BestBuddy />
      <BestJob />
      <BestJob2 />
      <BestJob3 />
      <Collab />
      <BestJob4 />
      <Banner />
      {/* <Pricing /> */}
      <UpcomingFeatures />
      <Blog />
      <Contact />
    </div>
  ) : (
    <InProgressPage />
  );
}
