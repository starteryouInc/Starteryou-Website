const mongoose = require("mongoose");

// Define a simple model
const TestModel = mongoose.model(
  "Test",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
    { timestamps: true }
  )
);

module.exports = TestModel;
