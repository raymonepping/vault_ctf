const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Start a new game
router.post("/start", gameController.startGame);

// Submit an attempt
router.post("/attempt", gameController.submitAttempt);

module.exports = router;
