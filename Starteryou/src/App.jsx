import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import JobPortalPage from "./pages/JobPortalPage";

function App() {
  return (
    <Router>
      <div className="font-montserrat scroll-smooth">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/jobs" element={<JobPortalPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
