import BestBuddy from "./components/BestBuddy";
import BestJob from "./components/BestJob";
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
      </div>
    </>
  );
}

export default App;
