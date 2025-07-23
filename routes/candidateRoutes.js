const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  deleteCandidate,
  getCandidatesByPosition,
} = require("../controllers/candidateController");

router.get("/", getCandidatesByPosition); // Public read-only access

const { updateCandidate, getCandidateById } = require("../controllers/candidateController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

// Admin-only create/delete
router.post("/", protect, isAdmin, createCandidate);
router.delete("/:id", protect, isAdmin, deleteCandidate);

// Public access
router.get("/", protect, getAllCandidates);

// Admin-only update candidate details
router.put("/:id", protect, isAdmin, updateCandidate);
// Get candidate by ID (for voting)
router.get("/:id", protect, getCandidateById);
// Export the router
module.exports = router;