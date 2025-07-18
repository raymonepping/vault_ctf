const express = require('express');
const router = express.Router()

// Import route modules
const healthRoutes = require('./health')
const pingRoutes = require('./ping')
const playerRoutes = require('./player')
const validateRoutes = require('./validate')

// Use the route modules
router.use('/health', healthRoutes)
router.use('/ping', pingRoutes)
router.use('/player', playerRoutes)
router.use('/validate', validateRoutes)

module.exports = router
