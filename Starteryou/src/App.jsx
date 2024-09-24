import Banner from "./components/Banner";
import BestBuddy from "./components/BestBuddy";
import BestJob from "./components/BestJob";
import BestJob2 from "./components/BestJob2";
import BestJob3 from "./components/BestJob3";
import BestJob4 from "./components/BestJob4";
import Collab from "./components/Collab";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";

function App() {
  return (
    <>
      <div className="font-montserrat">
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
      </div>
    </>
  );
}

export default App;
