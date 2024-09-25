import Banner from "./components/Banner";
import BestBuddy from "./components/BestBuddy";
import BestJob from "./components/BestJob";
import BestJob2 from "./components/BestJob2";
import BestJob3 from "./components/BestJob3";
import BestJob4 from "./components/BestJob4";
import Blog from "./components/Blog";
import Collab from "./components/Collab";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import UpcomingFeatures from "./components/UpcomingFeatures";

function App() {
  return (
    <>
      <div className="font-montserrat scroll-smooth">
        <Navbar />
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
        <Footer />
      </div>
    </>
  );
}

export default App;
