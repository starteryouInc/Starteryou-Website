const express = require("express");
const Subscriber = require("../models/Subscriber"); // Adjust the path if necessary
const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    const newSubscriber = new Subscriber({ name, email });
    await newSubscriber.save();

    return res.status(201).json({ message: "Subscription successful!" });
  } catch (err) {
    console.error("Error saving subscriber:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
