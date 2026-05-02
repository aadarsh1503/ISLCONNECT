const express = require('express');
const { getVideoTranslation } = require('../controllers/videoController');
const router = express.Router();

// Route to get sign language translation for a video
router.get('/translation/:videoId', getVideoTranslation);

module.exports = router;
