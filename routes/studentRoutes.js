const express = require("express");
const router = express.Router();
const { loginWithUniversity } = require("../controllers/studentAuthController");

router.post("/login", loginWithUniversity);

module.exports = router;
