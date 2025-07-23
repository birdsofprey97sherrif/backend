const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register); // Admin will register users
router.post("/login", login);

module.exports = router;
