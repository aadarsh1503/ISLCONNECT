const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    language: { type: String, default: 'english' },
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: false },
    username: { type: String, default: '' },
});

module.exports = mongoose.model('Settings', settingsSchema);
