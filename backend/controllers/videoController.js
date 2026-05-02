const path = require('path');

// Fetch sign language translation video
const getVideoTranslation = (req, res) => {
    const { videoId } = req.params;

    // Replace with a database lookup or other logic if needed
    const translationPath = path.join(__dirname, '../public/translations', `${videoId}.mp4`);

    // Check if file exists
    if (!path.extname(translationPath)) {
        return res.status(404).json({ message: 'Translation not found for this video.' });
    }

    res.sendFile(translationPath);
};

module.exports = { getVideoTranslation };
