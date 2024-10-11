// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from "./components/Footer";
// import Navbar from "./components/Navbar";
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import JobPortalPage from "./pages/JobPortalPage";
// import {
//   NavigationProvider,
//   NavigationHandler,
// } from "./context/NavigationContext"; // Import the new component
// import { UserProvider } from "./context/UserContext";

// function App() {
//   return (
//     <UserProvider>
//       <NavigationProvider>
//         <Router>
//           <NavigationHandler /> {/* Place this here */}
//           <div className="font-montserrat scroll-smooth">
//             <Navbar />
//             <Routes>
//               {/* Default Routes for everyone */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/jobs" element={<JobPortalPage />} />

//               {/* Admin Protected Routes (they render the same pages) */}
//               <Route path="/admin" element={<HomePage />} />
//               <Route path="/admin/about" element={<AboutPage />} />
//               <Route path="/admin/jobs" element={<JobPortalPage />} />
//             </Routes>
//             <Footer />
//           </div>
//         </Router>
//       </NavigationProvider>
//     </UserProvider>
//   );
// }

// export default App;

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
