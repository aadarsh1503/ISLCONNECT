
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    visitTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', visitSchema);
