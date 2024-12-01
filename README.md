# Starteryou Website

[![Deploy to AWS EC2s](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/develop.yml/badge.svg?branch=develop)](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/develop.yml)

[![Deploy to AWS EC2s](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/main.yml/badge.svg)](https://github.com/starteryouInc/Starteryou-Website/actions/workflows/main.yml)

Welcome to the Starteryou Website repository! This project is the official platform for StarterYou Inc., aimed at connecting high school and college students with part-time job opportunities, internships, and more. The platform is scalable, responsive, and built to serve the needs of students and employers alike.

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

## 📁 Project Structure
Starteryou-Website/
├── backend/                  # Backend service
│   ├── Dockerfile            # Backend Dockerfile
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server file
│   ├── routes/               # API route definitions
│   │   └── jobs.js           # Job-related APIs
│   ├── models/               # Database models
│   │   └── Job.js            # Job schema definition
│   ├── config/               # Configuration files (e.g., database connection)
│   └── uploads/              # Directory for file uploads
├── frontend/                 # Frontend service
│   ├── Dockerfile            # Frontend Dockerfile
│   ├── package.json          # Frontend dependencies
│   ├── public/               # Static assets
│   │   └── index.html        # Main HTML template
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   ├── pages/            # React pages (e.g., Home, Jobs)
│   │   ├── App.jsx           # Main React app
│   │   └── index.js          # React entry point
├── docker-compose.yml        # Docker Compose configuration
├── .env                      # Environment variables
└── README.md                 # Project documentation
