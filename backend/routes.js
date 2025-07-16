const express = require("express");
const router = express.Router();

// Import route modules
const bakingRoutes = require("./routes/bakingRoutes");
const gameRoutes = require("./routes/gameRoutes");

// Use the baking routes
router.use("/baking", bakingRoutes);

// Use the game routes
router.use("/gaming", gameRoutes);

module.exports = router;
