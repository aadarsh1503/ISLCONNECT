const fetch = require('node-fetch'); // For calling external APIs
const fs = require('fs');
const path = require('path');

// Function to process the image and return translation
const processImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required.' });
        }

        // Optional: Save the image locally (for debugging or logging)
        const base64Data = image.replace(/^data:image\/png;base64,/, '');
        const filePath = path.join(__dirname, '../uploads/image.png');
        fs.writeFileSync(filePath, base64Data, 'base64');

        // Call external API or custom ML model to process the image
        const apiResponse = await fetch('https://example-google-api-endpoint.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image }),
        });

        if (!apiResponse.ok) {
            throw new Error('Failed to process image.');
        }

        const result = await apiResponse.json();

        // Send translation result back to the frontend
        res.status(200).json({ translation: result.translation || 'No translation found.' });
    } catch (error) {
        console.error('Error processing image:', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

module.exports = { processImage };
