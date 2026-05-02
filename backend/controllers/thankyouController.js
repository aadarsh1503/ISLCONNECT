const Visit = require('../models/Visit');
const nodemailer = require('nodemailer');

// Log a visit to the database
const logVisit = async (req, res) => {
    const { userId, visitTime } = req.body;

    try {
        const newVisit = new Visit({ userId, visitTime: visitTime || new Date() });
        await newVisit.save();
        res.status(200).json({ message: 'Visit logged successfully.' });
    } catch (error) {
        console.error('Error logging visit:', error.message);
        res.status(500).json({ error: 'Failed to log visit.' });
    }
};

// Send a thank-you email
const sendThankYouEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank You for Visiting!',
            text: 'We appreciate your visit and hope to see you again soon.',
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Thank-you email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Failed to send email.' });
    }
};

module.exports = { logVisit, sendThankYouEmail };
