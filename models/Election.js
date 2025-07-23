const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Election", electionSchema);
