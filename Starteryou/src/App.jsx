import BestBuddy from "./components/BestBuddy";
import BestJob from "./components/BestJob";
import BestJob2 from "./components/BestJob2";
import BestJob3 from "./components/BestJob3";
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
      </div>
    </>
  );
}

export default App;
