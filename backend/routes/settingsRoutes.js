const express = require('express');
const { getSettings, saveSettings } = require('../controllers/settingsController');
const router = express.Router();

// Get user settings
router.get('/:userId', getSettings);

// Save or update user settings
router.post('/', saveSettings);

module.exports = router;
