const Election = require("../models/Election");

module.exports = async (req, res, next) => {
  const now = new Date();
  const activeElection = await Election.findOne({ isActive: true });

  if (!activeElection) {
    return res.status(403).json({ error: "No active election found." });
  }

  if (now < activeElection.startTime) {
    return res.status(403).json({ error: "Voting has not started yet." });
  }

  if (now > activeElection.endTime) {
    return res.status(403).json({ error: "Voting period has ended." });
  }

  // Pass election info if needed
  req.election = activeElection;
  next();
};
