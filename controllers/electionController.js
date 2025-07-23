const Election = require("../models/Election");

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
