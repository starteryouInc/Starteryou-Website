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
import AdminSignup from "./components/Auth/AdminSignup";
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
import UserProfile from "./pages/UserProfile";
import UserLogin from "./components/Auth/UserLogin";
import ForgotPswd from "./components/Auth/ForgotPswd";
import ResetCode from "./components/Auth/ResetCode";
import UpdatePswd from "./components/Auth/UpdatePswd";
import EmployerSignUp from "./components/Auth/EmployerSignUp";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostedJobs from "./components/CompanyDashboard/Pages/PostedJobs";
import ProfilePage from "./components/CompanyDashboard/Pages/ProfilePage";
import Profile1 from "./components/CompanyProfile/Profile1";
import Profile2 from "./components/CompanyProfile/Profile2";
import Profile3 from "./components/CompanyProfile/Profile3";
import ProfileCarousel from "./pages/ProfileCarousel";

const Layout = () => {
  const location = useLocation();

  // Scroll to top on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // This will run on every route change
  const hideNavbarFooter = [
    "/login",
    "/AdminSignup",
    "/signup",
    "/UserLogin",
    "/ForgotPswd",
    "/ResetCode",
    "/UpdatePswd",
    "/EmpSignUp",
    "/createProfile",
  ].includes(location.pathname);
  return (
    <div className="font-montserrat scroll-smooth">
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        {/* Default Routes for everyone */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/jobs" element={<JobPageBefore />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/AdminSignup" element={<AdminSignup />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/InProgressPage" element={<InProgressPage />} />
        <Route path="/job2" element={<JobPageAfter />} />
        <Route path="/jobfeeds" element={<JobFeedPage />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/ForgotPswd" element={<ForgotPswd />} />
        <Route path="/ResetCode" element={<ResetCode />} />
        <Route path="/UpdatePswd" element={<UpdatePswd />} />
        <Route path="/EmpSignUp" element={<EmployerSignUp />} />

        <Route path="/userprofile" element={<UserProfile />}></Route>

        <Route path="/companyDashboard" element={<CompanyDashboard />}>
          <Route path="/companyDashboard/" element={<ProfilePage />}></Route>
          <Route
            path="/companyDashboard/postedJobs"
            element={<PostedJobs />}
          ></Route>
        </Route>

        <Route path="/createProfile" element={<ProfileCarousel />} />

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
        {!hideNavbarFooter && <NewsLetter />}
      </div>
      {!hideNavbarFooter && <Footer />}
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
