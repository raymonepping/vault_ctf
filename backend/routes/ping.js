const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'pong from backend' })
})

module.exports = router
