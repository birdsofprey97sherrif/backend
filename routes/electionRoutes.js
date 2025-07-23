const express = require("express");
const router = express.Router();
const { createElection } = require("../controllers/electionController");
const { getActiveElection } = require("../controllers/electionController");

const { protect, adminOnly } = require("../middleware/auth");

router.post("/", protect, adminOnly, createElection); // Only admins can create

module.exports = router;
