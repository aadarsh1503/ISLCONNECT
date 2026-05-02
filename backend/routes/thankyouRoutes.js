const express = require('express');
const { logVisit, sendThankYouEmail } = require('../controllers/thankyouController');
const router = express.Router();

// Route to log a visit
router.post('/log-visit', logVisit);

// Route to send a thank-you email
router.post('/send-email', sendThankYouEmail);

module.exports = router;
