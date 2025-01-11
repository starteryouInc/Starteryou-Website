const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
