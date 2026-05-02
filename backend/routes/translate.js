const express = require('express');
const { processImage } = require('../controllers/translateController');
const router = express.Router();

// Route to handle translation requests
router.post('/', processImage);

module.exports = router;
