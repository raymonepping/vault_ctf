const express = require('express');
const router = express.Router()

// Import route modules
const healthRoutes = require('./health')
const pingRoutes = require('./ping')

// Use the route modules
router.use('/health', healthRoutes)
router.use('/ping', pingRoutes)

module.exports = router
