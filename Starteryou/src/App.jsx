import BestBuddy from "./components/BestBuddy";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div className="font-montserrat">
        <Navbar />
        <Hero />
        <BestBuddy />
      </div>
    </>
  );
}

export default App;
