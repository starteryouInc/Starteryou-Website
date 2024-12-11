const express = require("express");
const router = express.Router();
const TestModel = require("../models/TestModel");

// GET route to fetch all records
router.get("/", async (req, res) => {
  try {
    console.log("[GET /api/test] Fetching all records...");
    const records = await TestModel.find();
    console.log(
      `[GET /api/test] Successfully fetched ${records.length} records.`
    );
    res.status(200).json(records);
  } catch (error) {
    console.error("[GET /api/test] Error fetching records:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch records", details: error.message });
  }
});

// PUT route to add a new record
router.put("/", async (req, res) => {
  const { name, value } = req.body;

  // Validate input
  if (!name || !value) {
    console.warn("[PUT /api/test] Validation error: Name or value missing.");
    return res.status(400).json({ error: "Name and value are required" });
  }

  try {
    console.log("[PUT /api/test] Adding a new record...");
    const newRecord = new TestModel({ name, value });
    const savedRecord = await newRecord.save();
    console.log("[PUT /api/test] Record added successfully:", savedRecord);
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("[PUT /api/test] Error creating record:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create record", details: error.message });
  }
});

module.exports = router;
