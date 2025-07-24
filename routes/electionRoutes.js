const express = require("express");
const router = express.Router();
const { createElection } = require("../controllers/electionController");
const electionController = require("../controllers/electionController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

const { protect, adminOnly } = require("../middleware/auth");

router.post("/", protect, adminOnly, createElection); // Only admins can create
// Fetch active election
router.get('/active', electionController.getActiveElection);

// Deactivate (close) election manually — admin only
router.patch('/:id/deactivate', isAuthenticated, isAdmin, electionController.deactivateElection);

module.exports = router;
