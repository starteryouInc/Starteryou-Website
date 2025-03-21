/**
 * Main application component that sets up routing, context providers, and layout.
 * @returns {JSX.Element} The application component.
 */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
import EducationPage from "./pages/EducationPage";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Signup from "./components/Auth/Signup";
import InProgressPage from "./components/Common/InProgressPage";
import JobPageBefore from "./pages/JobPageBefore"; // Ensure this file exists in the "pages" directory.
import JobPageAfter from "./pages/JobPageAfter"; // Ensure this file exists in the "pages" directory.
import JobFeedPage from "./pages/JobFeedPage";
import NewsLetter from "./components/Common/NewsLetter";
import SessionTimer from "./components/Common/SessionTimer";
import UserProfile from "./pages/UserProfile";
import UserLogin from "./components/Auth/UserLogin";
import ForgotPswd from "./components/Auth/ForgotPswd";
import ResetCode from "./components/Auth/ResetCode";
import UpdatePswd from "./components/Auth/UpdatePswd";
import EmployerSignUp from "./components/Auth/EmployerSignUp";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostedJobs from "./components/CompanyDashboard/Pages/PostedJobs";
import ProfilePage from "./components/CompanyDashboard/Pages/ProfilePage";
import ProfileCarousel from "./pages/ProfileCarousel";
import NotFound from "./components/Common/NotFound";


/**
 * Layout component that defines the main page structure and handles route changes.
 * @returns {JSX.Element} The layout component.
 */
const Layout = () => {
  const location = useLocation();

  /**
   * Scrolls to the top of the page when the route changes.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // This will run on every route change
  const adminRoutes = [
    "/admin",
    "/admin/about",
    "/admin/jobs",
    "/admin/education",
    "/admin/job2",
  ]; // Add all admin-related pages
  const isNotFoundPage =
    location.pathname !== "/" &&
    ![
      "/about",
      "/jobs",
      "/login",
      "/AdminSignup",
      "/education",
      "/signup",
      "/InProgressPage",
      "/job2",
      "/jobfeeds",
      "/UserLogin",
      "/ForgotPswd",
      "/ResetCode",
      "/UpdatePswd",
      "/EmpSignUp",
      "/userprofile",
      "/companyDashboard",
      "/createProfile",
      ...adminRoutes, // Ensure admin pages are not treated as "not found"
    ].includes(location.pathname);

  const hideNavbarFooter =
    (isNotFoundPage && !adminRoutes.includes(location.pathname)) || // Allow navbar for admin routes
    [
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
      {/* Session Timer added inside Layout */}
      <SessionTimer />

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
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* New Letter has beeen installed in the website ( IN PROGRESS ) */}
      <div className="flex justify-center items-center">
        {!hideNavbarFooter && <NewsLetter />}
      </div>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

/**
 * Main application component that wraps the application with necessary providers.
 * @returns {JSX.Element} The application component.
 */
function App() {
  return (
    <UserProvider>
      <NavigationProvider>
        <Toaster
          position="bottom-right"
          autoClose={3000}
          reverseOrder={false}
        />
        <Router>
          <NavigationHandler />
          <Layout />
        </Router>
      </NavigationProvider>
    </UserProvider>
  );
}

export default App;
