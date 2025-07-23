const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    position: { type: String, required: true }, // e.g. President, Treasurer
    manifesto: { type: String, required: true },
    photo: { type: String }, // Optional: for frontend display
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    manifesto: {
      type: String, // or file path / URL if uploaded
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
