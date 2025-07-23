const express = require("express");
const router = express.Router();
const { castVote, getResults } = require("../controllers/voteController");
const { protect } = require("../middleware/authMiddleware");
const checkElectionWindow = require("../middleware/checkElectionWindow");

router.post("/", protect, checkElectionWindow, castVote);

router.post("/", protect, castVote);
router.get("/results", protect, getResults);

module.exports = router;
