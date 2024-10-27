import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import JobPortalPage from "./pages/JobPortalPage";
import {
  NavigationProvider,
  NavigationHandler,
} from "./context/NavigationContext";
import AdminProtectedRoute from "./components/Common/AdminProtectedRoute";
import { UserProvider } from "./context/UserContext";
import LoginPage from "./components/Auth/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobPage from "./pages/JobPage";
import EducationPage from "./pages/EducationPage";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Signup from "./components/Auth/Signup";

const Layout = () => {
  const location = useLocation();

  // Scroll to top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // This will run on every route change

  return (
    <div className="font-montserrat scroll-smooth">
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        {/* Default Routes for everyone */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobPortalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/job2" element={<JobPage />} />
        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={<AdminProtectedRoute element={<HomePage />} />}
        />
        <Route
          path="/admin/about"
          element={<AdminProtectedRoute element={<AboutPage />} />}
        />
        <Route
          path="/admin/jobs"
          element={<AdminProtectedRoute element={<JobPortalPage />} />}
        />
        <Route
          path="/admin/education"
          element={<AdminProtectedRoute element={<EducationPage />} />}
        />
        <Route
          path="/admin/job2"
          element={<AdminProtectedRoute element={<JobPage />} />}
        />
      </Routes>
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <NavigationProvider>
        <Router>
          <NavigationHandler />
          <Layout />
          <ToastContainer />
        </Router>
      </NavigationProvider>
    </UserProvider>
  );
}

export default App;
