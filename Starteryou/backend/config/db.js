// config/db.js
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://54.196.202.145:27017/starteryou", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
