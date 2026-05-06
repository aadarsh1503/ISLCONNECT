const express = require('express');
const { getVideoTranslation } = require('../controllers/videoController');
const router = express.Router();


router.get('/translation/:videoId', getVideoTranslation);

module.exports = router;
