// server.js
const express = require('express');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// Set mongoose options to suppress the deprecation warning
mongoose.set('strictQuery', false); // Add this line to suppress the warning

// Use CORS middleware to allow all origins
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/files', fileRoutes); // Define your file routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
