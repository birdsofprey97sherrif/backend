const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
 const sendEmail = require("../utils/sendEmail");
// ✅ Cast Vote
exports.castVote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { votes } = req.body; // [{ position, candidateId }]

    for (const v of votes) {
      const candidate = await Candidate.findById(v.candidateId);
      if (!candidate || candidate.position !== v.position) {
        return res
          .status(400)
          .json({ error: `Invalid candidate for ${v.position}` });
      }

      const existing = await Vote.findOne({
        voter: userId,
        position: v.position,
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: `Already voted for ${v.position}` });
      }

      await Vote.create({
        voter: userId,
        candidate: v.candidateId,
        position: v.position,
      });
    }
   

    // After vote.save()
    await sendEmail(
      req.user.email,
      "Vote Confirmation",
      `Hi ${req.user.fullName}, you have successfully voted for ${Candidate.fullName} as ${Candidate.position}.`
    );


    res.status(201).json({ message: "Votes cast successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Get Results
exports.getResults = async (req, res) => {
  try {
    const { position } = req.query; // /api/vote/results?position=President

    const matchStage = position ? { position } : {};

    const results = await Vote.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$candidate",
          voteCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidate",
        },
      },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          candidateId: "$candidate._id",
          fullName: "$candidate.fullName",
          position: "$candidate.position",
          voteCount: 1,
        },
      },
      { $sort: { position: 1, voteCount: -1 } },
    ]);

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗳️ Get User's Votes
exports.getUserVotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const votes = await Vote.find({ voter: userId })
      .populate("candidate", "fullName position")
      .select("position candidate");

    res.status(200).json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// 🗳️ Get Vote Count by Position
exports.getVoteCountByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const count = await Vote.countDocuments({ position });

    res.status(200).json({ position, voteCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// 🗳️ Get Vote Count by Candidate
exports.getVoteCountByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const count = await Vote.countDocuments({ candidate: candidateId });
    if (count === 0) {
      return res.status(404).json({ message: "No votes found for this candidate" });
    }
    res.status(200).json({ candidateId, voteCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const Election = require("../models/Election");

exports.castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const studentId = req.user._id;

    // Find active election
    const activeElection = await Election.findOne({
      isActive: true,
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() },
    });

    if (!activeElection) {
      return res
        .status(400)
        .json({ error: "No active election at the moment." });
    }

    // Check if student already voted in this election
    const existingVote = await Vote.findOne({
      student: studentId,
      election: activeElection._id,
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ error: "You have already voted in this election." });
    }

    // Save vote
    const vote = new Vote({
      student: studentId,
      candidate: candidateId,
      election: activeElection._id,
    });

    await vote.save();

    res.status(201).json({ message: "Vote cast successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
