const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true }
);

// 🛡️ Prevent voting twice for same position
voteSchema.index({ voter: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
