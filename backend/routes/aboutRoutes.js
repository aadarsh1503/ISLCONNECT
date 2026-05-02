const express = require('express');
const About = require('../backend/models/About.js');
const router = express.Router();

// Fetch About Us Content
router.get('/', async (req, res) => {
    try {
        const aboutData = await About.findOne();
        if (!aboutData) return res.status(404).json({ error: 'Content not found' });

        res.status(200).json(aboutData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching content' });
    }
});

// Update About Us Content
router.put('/', async (req, res) => {
    const { mission, offerings, whyChooseUs } = req.body;

    try {
        let aboutData = await About.findOne();
        if (!aboutData) {
            aboutData = new About({ mission, offerings, whyChooseUs });
        } else {
            aboutData.mission = mission;
            aboutData.offerings = offerings;
            aboutData.whyChooseUs = whyChooseUs;
        }

        await aboutData.save();
        res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating content' });
    }
});

module.exports = router;
