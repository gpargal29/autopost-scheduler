const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Quote Auto Scheduler API is active and healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
