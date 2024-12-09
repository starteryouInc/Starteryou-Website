import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

import {
  NavigationProvider,
  NavigationHandler,
} from "./context/NavigationContext";
import AdminProtectedRoute from "./components/Common/AdminProtectedRoute";
import { UserProvider } from "./context/UserContext";
import LoginPage from "./components/Auth/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EducationPage from "./pages/EducationPage";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Signup from "./components/Auth/Signup";
import InProgressPage from "./components/Common/InProgressPage";
import JobPageBefore from "./pages/JobPageBefore"; // Ensure this file exists in the "pages" directory.
import JobPageAfter from "./pages/JobPageAfter"; // Ensure this file exists in the "pages" directory.
import JobFeedPage from "./pages/JobFeedPage";
import NewsLetter from "./components/Common/NewsLetter";

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
        <Route path="/jobs" element={<JobPageBefore />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/InProgressPage" element={<InProgressPage />} />
        <Route path="/job2" element={<JobPageAfter />} />

        {/* New Job Feed Page ( IN PROGRESS )*/}
        <Route path="/jobfeeds" element={<JobFeedPage />} />

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
          element={<AdminProtectedRoute element={<JobPageBefore />} />}
        />
        <Route
          path="/admin/education"
          element={<AdminProtectedRoute element={<EducationPage />} />}
        />
        <Route
          path="/admin/job2"
          element={<AdminProtectedRoute element={<JobPageAfter />} />}
        />
      </Routes>

      {/* New Letter has beeen installed in the website ( IN PROGRESS ) */}
      <div className="flex justify-center items-center">
        {location.pathname !== "/login" && <NewsLetter />}
      </div>
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
