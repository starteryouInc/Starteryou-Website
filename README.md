# Starteryou Website

[![Deploy to AWS EC2s](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/develop.yml/badge.svg?branch=develop)](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/develop.yml)

[![Deploy to AWS EC2-PROD-SERVER](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/main.yml)

Welcome to the Starteryou Website repository! This project is the official platform for Starteryou Inc., aimed at connecting high school and college students with part-time job opportunities, internships, and more. The platform is scalable, responsive, and built to serve the needs of students and employers alike.

## 🌐 Links
- **Development Environment:** [http://dev.starteryou.com:8080/](http://dev.starteryou.com:8080/)
- **Production Environment:** [https://starteryou.com/](https://starteryou.com/)

## 🚀 Features

- Job Listings: Explore part-time job opportunities such as cashiers, store vendors, and more.
- CRUD Functionality: All data, including job listings, applications, and user profiles, is dynamically loaded and managed through APIs.
- Scalable Architecture: Powered by container-based infrastructure for automatic scaling.
- Responsive Design: Built using React Bootstrap for a seamless user experience across devices.
- Secure Hosting: Hosted on AWS with MongoDB as the database backend and HTTPS enabled via SSL.
- Student-Centric Services:
  - Ridesharing for students.
  - Volunteer opportunities.
  - School pages with details about events, clubs, and mentors.

## 🛠️ Tech Stack

- Frontend: React with Vite for fast development.
- Backend: Node.js and Express.js.
- Database: MongoDB.
- Hosting: AWS (EC2, Docker).
- CI/CD: GitHub Actions for streamlined deployment.
- Containerization: Docker for isolated environments and scalability.

## 🔧 Setup Instructions

### Prerequisites
- Node.js >= 16.x
- Docker >= 20.x
- MongoDB
- AWS CLI (optional for deployment)

### Development Environment
1. Clone the repository:
   ```bash
   git clone https://github.com/starteryouInc/Starteryou-Website.git
   cd Starteryou-Website
   ```

---
### Project Structure
Here is the project structure tree for the "StarterYou Website":

```
Directory structure:
└── starteryouInc-Starteryou-Website.git/
    ├── Starteryou/
    │   ├── .gitignore
    │   ├── backend/
    │   │   ├── docs/
    │   │   │   ├── global.html
    │   │   │   ├── index.html
    │   │   │   ├── scripts/
    │   │   │   │   ├── linenumber.js
    │   │   │   │   └── prettify/
    │   │   │   │       ├── prettify.js
    │   │   │   │       ├── Apache-License-2.0.txt
    │   │   │   │       └── lang-css.js
    │   │   │   ├── routes_textRoutes.js.html
    │   │   │   ├── models_TextContent.js.html
    │   │   │   ├── fonts/
    │   │   │   │   ├── OpenSans-LightItalic-webfont.eot
    │   │   │   │   ├── OpenSans-BoldItalic-webfont.eot
    │   │   │   │   ├── OpenSans-Regular-webfont.woff
    │   │   │   │   ├── OpenSans-Light-webfont.eot
    │   │   │   │   ├── OpenSans-BoldItalic-webfont.woff
    │   │   │   │   ├── OpenSans-LightItalic-webfont.woff
    │   │   │   │   ├── OpenSans-Italic-webfont.woff
    │   │   │   │   ├── OpenSans-Bold-webfont.eot
    │   │   │   │   ├── OpenSans-Regular-webfont.eot
    │   │   │   │   ├── OpenSans-Italic-webfont.eot
    │   │   │   │   ├── OpenSans-Bold-webfont.woff
    │   │   │   │   └── OpenSans-Light-webfont.woff
    │   │   │   ├── styles/
    │   │   │   │   ├── prettify-tomorrow.css
    │   │   │   │   ├── jsdoc-default.css
    │   │   │   │   └── prettify-jsdoc.css
    │   │   │   ├── module-TextContent.html
    │   │   │   └── textRoutes.js.html
    │   │   ├── server.js
    │   │   ├── package.json
    │   │   ├── jsconfig.json
    │   │   ├── models/
    │   │   │   ├── TextContent.js
    │   │   │   └── FileMetadata.js
    │   │   ├── routes/
    │   │   │   ├── fileRoutes.js
    │   │   │   ├── verificationRoutes.js
    │   │   │   ├── textRoutes.js
    │   │   │   └── index.js
    │   │   ├── jsdoc.config.json
    │   │   ├── dockerfile
    │   │   ├── package-lock.json
    │   │   ├── middleware/
    │   │   │   └── apiLogger.js
    │   │   └── utils/
    │   │       ├── testMongo.js
    │   │       └── mongoTester.js
    │   ├── frontend/
    │   │   ├── docs/
    │   │   │   └── frontend/
    │   │   │       ├── global.html
    │   │   │       ├── index.html
    │   │   │       ├── scripts/
    │   │   │       │   ├── linenumber.js
    │   │   │       │   └── prettify/
    │   │   │       │       ├── prettify.js
    │   │   │       │       ├── Apache-License-2.0.txt
    │   │   │       │       └── lang-css.js
    │   │   │       ├── module-BetterFuture.html
    │   │   │       ├── OurVision.jsx.html
    │   │   │       ├── fonts/
    │   │   │       │   ├── OpenSans-LightItalic-webfont.eot
    │   │   │       │   ├── OpenSans-BoldItalic-webfont.eot
    │   │   │       │   ├── OpenSans-Regular-webfont.woff
    │   │   │       │   ├── OpenSans-Light-webfont.eot
    │   │   │       │   ├── OpenSans-BoldItalic-webfont.woff
    │   │   │       │   ├── OpenSans-LightItalic-webfont.woff
    │   │   │       │   ├── OpenSans-Italic-webfont.woff
    │   │   │       │   ├── OpenSans-Bold-webfont.eot
    │   │   │       │   ├── OpenSans-Regular-webfont.eot
    │   │   │       │   ├── OpenSans-Italic-webfont.eot
    │   │   │       │   ├── OpenSans-Bold-webfont.woff
    │   │   │       │   └── OpenSans-Light-webfont.woff
    │   │   │       ├── OurMission.jsx.html
    │   │   │       ├── HeroAbout.jsx.html
    │   │   │       ├── styles/
    │   │   │       │   ├── prettify-tomorrow.css
    │   │   │       │   ├── jsdoc-default.css
    │   │   │       │   └── prettify-jsdoc.css
    │   │   │       ├── module-OurVision.html
    │   │   │       ├── Team.jsx.html
    │   │   │       ├── TechTeam.jsx.html
    │   │   │       └── BetterFuture.jsx.html
    │   │   ├── index.html
    │   │   ├── eslint.config.js
    │   │   ├── nginx.conf
    │   │   ├── public/
    │   │   │   ├── LandingPage/
    │   │   │   │   └── Icons/
    │   │   │   ├── JobPage/
    │   │   │   ├── AboutPage/
    │   │   │   │   ├── TechTeam/
    │   │   │   │   └── Team/
    │   │   │   └── JobPortalPage/
    │   │   ├── postcss.config.js
    │   │   ├── package.json
    │   │   ├── vite.config.js
    │   │   ├── jsdoc.config.json
    │   │   ├── dockerfile
    │   │   ├── package-lock.json
    │   │   ├── tailwind.config.js
    │   │   └── src/
    │   │       ├── App.jsx
    │   │       ├── index.css
    │   │       ├── context/
    │   │       │   ├── NavigationContext.jsx
    │   │       │   ├── ProtectedRoute.jsx
    │   │       │   └── UserContext.jsx
    │   │       ├── assets/
    │   │       ├── components/
    │   │       │   ├── Education/
    │   │       │   │   ├── EduHero.jsx
    │   │       │   │   ├── UnlockPotential.jsx
    │   │       │   │   ├── OurInsight.jsx
    │   │       │   │   ├── StartJourney.jsx
    │   │       │   │   ├── Testimonials.jsx
    │   │       │   │   ├── ComprehensiveFeatures.jsx
    │   │       │   │   └── YourJourney.jsx
    │   │       │   ├── Auth/
    │   │       │   │   ├── LoginPage.jsx
    │   │       │   │   └── Signup.jsx
    │   │       │   ├── Landing/
    │   │       │   │   ├── Banner.jsx
    │   │       │   │   ├── Contact.jsx
    │   │       │   │   ├── Pricing.jsx
    │   │       │   │   ├── BestJob4.jsx
    │   │       │   │   ├── BestBuddy.jsx
    │   │       │   │   ├── BestJob2.jsx
    │   │       │   │   ├── Collab.jsx
    │   │       │   │   ├── UpcomingFeatures.css
    │   │       │   │   ├── Hero.jsx
    │   │       │   │   ├── BestJob3.jsx
    │   │       │   │   ├── Blog.jsx
    │   │       │   │   ├── UpcomingFeatures.jsx
    │   │       │   │   └── BestJob.jsx
    │   │       │   ├── JobPage/
    │   │       │   │   ├── AppSupport.jsx
    │   │       │   │   ├── DiscoverFuture.jsx
    │   │       │   │   ├── TailoredJob.jsx
    │   │       │   │   ├── IdealJob.jsx
    │   │       │   │   ├── Reviews.jsx
    │   │       │   │   └── JobHero.jsx
    │   │       │   ├── JobPortal/
    │   │       │   │   ├── HeroJobPortal.jsx
    │   │       │   │   ├── LatestInsight.jsx
    │   │       │   │   ├── LaunchBanner.jsx
    │   │       │   │   ├── UnlockPotential.jsx
    │   │       │   │   ├── PathStart.jsx
    │   │       │   │   ├── DiscoverPath.jsx
    │   │       │   │   └── JobListing.jsx
    │   │       │   ├── About/
    │   │       │   │   ├── HeroAbout.jsx
    │   │       │   │   ├── BetterFuture.jsx
    │   │       │   │   ├── TechTeam.jsx
    │   │       │   │   ├── OurVision.jsx
    │   │       │   │   ├── OurMission.jsx
    │   │       │   │   └── Team.jsx
    │   │       │   └── Common/
    │   │       │       ├── Footer.jsx
    │   │       │       ├── AdminProtectedRoute.jsx
    │   │       │       ├── FileUpload.jsx
    │   │       │       └── Navbar.jsx
    │   │       ├── hooks/
    │   │       │   └── useFileOperations.js
    │   │       ├── main.jsx
    │   │       ├── config/
    │   │       │   └── api.js
    │   │       ├── pages/
    │   │       │   ├── HomePage.jsx
    │   │       │   ├── JobPortalPage.jsx
    │   │       │   ├── EducationPage.jsx
    │   │       │   ├── _app.js
    │   │       │   ├── JobPage.jsx
    │   │       │   └── AboutPage.jsx
    │   │       ├── App.css
    │   │       └── utils/
    │   │           └── fileOperations.js
    │   └── docker-compose.yml
    ├── .github/
    │   └── workflows/
    │       ├── develop.yml
    │       └── main.yml
    └── README.md
```
