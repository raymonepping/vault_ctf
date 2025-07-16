// routes/index.js
const express = require("express");
const router = express.Router();

const bakingRoutes = require("./bakingRoutes");
const gameRoutes = require("./gameRoutes");

// Use baking routes
app.use("/api/baking", bakingRoutes);

// Use gaming routes
router.use("/api/gaming", gameRoutes);

module.exports = router;
