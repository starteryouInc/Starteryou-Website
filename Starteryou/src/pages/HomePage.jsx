import Hero from "../components/Hero";
import BestBuddy from "../components/BestBuddy";
import BestJob from "../components/BestJob";
import BestJob2 from "../components/BestJob2";
import BestJob3 from "../components/BestJob3";
import Collab from "../components/Collab";
import BestJob4 from "../components/BestJob4";
import Banner from "../components/Banner";
import Pricing from "../components/Pricing";
import UpcomingFeatures from "../components/UpcomingFeatures";
import Blog from "../components/Blog";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BestBuddy />
      <BestJob />
      <BestJob2 />
      <BestJob3 />
      <Collab />
      <BestJob4 />
      <Banner />
      <Pricing />
      <UpcomingFeatures />
      <Blog />
      <Contact />
    </div>
  );
}
