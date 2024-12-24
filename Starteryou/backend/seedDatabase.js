const TextContent = require("./models/TextContent"); // Import your model
const connectToMongoDB = require("./db"); // Import the connection function from db.js
const mongoose = require("mongoose"); // Required for MongoDB interaction
mongoose.set("debug", true);

const seedDatabase = async () => {
  try {
    console.log("Seeding Database...");
    console.log("Mongoose Connection State:", mongoose.connection.readyState);

    const existingData = await TextContent.find({});
    if (existingData.length > 0) {
      console.log("⚠️ Database already seeded. Skipping seeding process.");
      return;
    }

    const seedData = [
      {
        page: "Homepage",
        component: "Header",
        content: "Welcome to StarterYou!",
        paragraphs: ["Paragraph 1", "Paragraph 2"],
      },
      {
        page: "About",
        component: "Section",
        content: "About us content here.",
        paragraphs: ["Our mission", "Our team"],
      },
    ];

    await TextContent.insertMany(seedData);
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

// If this script is run directly, connect to MongoDB and seed
if (require.main === module) {
  (async () => {
    try {
      await connectToMongoDB(); // Ensure MongoDB connection is established
      await seedDatabase(); // Seed the database
    } catch (error) {
      console.error("❌ Error during database seeding:", error);
    }
  })();
}

module.exports = seedDatabase;
