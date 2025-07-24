const cron = require("node-cron");
const Election = require("../models/Election");

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    const expiredElections = await Election.find({
      isActive: true,
      endTime: { $lt: now },
    });

    for (const election of expiredElections) {
      election.isActive = false;
      await election.save();
      console.log(`Election "${election.name}" auto-deactivated.`);
    }
  } catch (err) {
    console.error("Cron job error:", err.message);
  }
});
