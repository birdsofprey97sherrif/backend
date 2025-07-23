const Candidate = require("../models/Candidate");

// Admin: Create a candidate
exports.createCandidate = async (req, res) => {
  try {
    const { fullName, position, manifesto } = req.body;
    const candidate = await Candidate.create({
      fullName,
      position,
      manifesto,
      createdBy: req.user.userId, // from authMiddleware
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Anyone: Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete candidate (optional)
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.status(200).json({ message: "Candidate removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
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
const Candidate = require("../models/Candidate");

// 👁️ Read-only list of candidates by position
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { position } = req.query;

    const query = position ? { position } : {};
    const candidates = await Candidate.find(query).select(
      "fullName position manifesto"
    );

    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
