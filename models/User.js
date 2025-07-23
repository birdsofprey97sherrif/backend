// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  admissionNumber: { type: String, unique: true },
  fullName: String,
  password: String, // or hashed biometric token
  role: { type: String, enum: ["student", "admin"], default: "student" },
  hasVoted: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
