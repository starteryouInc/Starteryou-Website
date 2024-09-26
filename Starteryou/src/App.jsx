import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="font-montserrat scroll-smooth">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
