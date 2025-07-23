const User = require("../models/User");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const sendEmail = require("../utils/sendEmail");

exports.remindNonVoters = async (req, res) => {
  try {
    const election = await Election.findOne({ isActive: true });
    if (!election) return res.status(400).json({ error: "No active election" });

    const voters = await Vote.distinct("student", { election: election._id });
    const nonVoters = await User.find({
      role: "student",
      _id: { $nin: voters },
    });

    for (let user of nonVoters) {
      if (user.email) {
        await sendEmail(
          user.email,
          "Reminder to Vote 🗳️",
          `Hi ${user.name},\n\nDon't forget to cast your vote in the ongoing election: "${election.name}".`
        );
      }
    }

    res.status(200).json({ message: `${nonVoters.length} reminders sent.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
