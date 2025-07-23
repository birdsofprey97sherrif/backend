const express = require("express");
const router = express.Router();
const { getVotingStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/voting-stats", protect, adminOnly, getVotingStats);

module.exports = router;
