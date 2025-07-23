const User = require("../models/User");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
exports.getVotingStats = async (req, res) => {
  try {
    // Total students eligible to vote
    const totalStudents = await User.countDocuments({ role: "student" });

    // Unique student IDs who voted
    const voters = await Vote.distinct("student");
    const studentsVoted = voters.length;

    // Turnout %
    const turnout = ((studentsVoted / totalStudents) * 100).toFixed(2);

    // Votes per position
    const votesPerPosition = await Vote.aggregate([
      {
        $lookup: {
          from: "candidates",
          localField: "candidate",
          foreignField: "_id",
          as: "candidateInfo",
        },
      },
      { $unwind: "$candidateInfo" },
      {
        $group: {
          _id: "$candidateInfo.position",
          totalVotes: { $sum: 1 },
        },
      },
      { $sort: { totalVotes: -1 } },
    ]);

    res.status(200).json({
      totalStudents,
      studentsVoted,
      turnout: `${turnout}%`,
      votesPerPosition,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createElection = async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;

    if (new Date(endTime) <= new Date(startTime)) {
      return res
        .status(400)
        .json({ error: "End time must be after start time." });
    }

    // Optional: deactivate existing active elections
    await Election.updateMany({ isActive: true }, { isActive: false });

    const election = new Election({ name, startTime, endTime });
    await election.save();

    res
      .status(201)
      .json({ message: "Election created successfully", election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getActiveElection = async (req, res) => {
  try {
    const election = await Election.findOne({ isActive: true });
    if (!election) return res.status(404).json({ message: "No active election found" });
    res.status(200).json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Admin: Delete candidate (optional)
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.status(200).json({ message: "Candidate removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Admin: Update candidate details
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, position, manifesto } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { fullName, position, manifesto },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get candidate by ID (for voting)
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get candidates by position (for voting)
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const candidates = await Candidate.find({ position });
    if (candidates.length === 0) return res.status(404).json({ message: "No candidates found for this position" });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}