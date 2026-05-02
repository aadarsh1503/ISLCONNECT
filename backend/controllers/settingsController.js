const Settings = require('../models/Settings');

// Get user settings
const getSettings = async (req, res) => {
    const { userId } = req.params;

    try {
        const userSettings = await Settings.findOne({ userId });
        if (!userSettings) {
            return res.status(404).json({ message: 'Settings not found.' });
        }
        res.status(200).json(userSettings);
    } catch (error) {
        console.error('Error fetching settings:', error.message);
        res.status(500).json({ error: 'Failed to fetch settings.' });
    }
};

// Save or update user settings
const saveSettings = async (req, res) => {
    const { userId, language, theme, notifications, username } = req.body;

    try {
        let userSettings = await Settings.findOne({ userId });

        if (userSettings) {
            // Update existing settings
            userSettings.language = language;
            userSettings.theme = theme;
            userSettings.notifications = notifications;
            userSettings.username = username;
        } else {
            // Create new settings
            userSettings = new Settings({
                userId,
                language,
                theme,
                notifications,
                username,
            });
        }

        await userSettings.save();
        res.status(200).json({ message: 'Settings saved successfully.', settings: userSettings });
    } catch (error) {
        console.error('Error saving settings:', error.message);
        res.status(500).json({ error: 'Failed to save settings.' });
    }
};

module.exports = { getSettings, saveSettings };
