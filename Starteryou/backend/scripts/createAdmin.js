const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config(); // Add this at the very top

mongoose.set("strictQuery", false);
const mongoURI =
  "mongodb://starteryouadmin:StarteryouAdmin2024@localhost:27017/starteryou?authSource=admin"; // Add database name 'starteryou'

const createAdminUser = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({username: "admin"});
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdminUser();
