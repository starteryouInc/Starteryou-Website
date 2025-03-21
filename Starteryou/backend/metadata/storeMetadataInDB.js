const mongoose = require("mongoose");
const { BaseUser, JobSeeker, Employer } = require("../models/BaseUserSchema");

// Function to store metadata in separate collections
const storeMetadataInDB = async () => {
  try {
    console.log("📌 Generating and Storing Metadata...");

    const models = { BaseUser, JobSeeker, Employer };

    for (const [modelName, model] of Object.entries(models)) {
      const collection = mongoose.connection.collection(
        model.collection.collectionName
      );
      const schema = model.schema.paths;
      const indexes = await collection.indexes();
      const documentCount = await collection.estimatedDocumentCount();
      const sampleData = await collection.findOne(
        {},
        { projection: { _id: 0 } }
      );

      const fields = Object.keys(schema).reduce((acc, field) => {
        acc[field] = {
          type: schema[field].instance,
          required: schema[field].isRequired ? true : false,
          unique: schema[field]._index?.unique || false,
        };
        return acc;
      }, {});

      const metadata = {
        timestamp: new Date(),
        collection: model.collection.collectionName,
        totalDocuments: documentCount,
        fields,
        indexes,
        sampleData: sampleData || "No sample data available",
      };

      // Define a new collection for storing metadata
      const MetadataModel = mongoose.model(
        `${modelName}Metadata`,
        new mongoose.Schema({}, { strict: false }),
        `${modelName.toLowerCase()}_metadata`
      );

      // Clear previous metadata for the model and insert new metadata
      await MetadataModel.deleteMany({});
      await MetadataModel.create(metadata);

      console.log(
        `✅ Metadata stored in '${modelName.toLowerCase()}_metadata' collection`
      );
    }

    console.log("🎉 Metadata generation completed!");
  } catch (error) {
    console.error("❌ Error storing metadata:", error);
  }
};

// Export function for use in `server.js`
module.exports = { storeMetadataInDB };
