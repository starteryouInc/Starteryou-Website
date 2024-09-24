import BestBuddy from "./components/BestBuddy";
import BestJob from "./components/BestJob";
import BestJob2 from "./components/BestJob2";
import BestJob3 from "./components/BestJob3";
import BestJob4 from "./components/BestJob4";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

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
        <BestJob4 />
      </div>
    </>
  );
}

export default App;
