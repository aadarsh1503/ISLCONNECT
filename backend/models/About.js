// const mongoose = require('mongoose');

// const aboutSchema = new mongoose.Schema({
//     mission: { type: String, required: true },
//     offerings: { type: [String], required: true },
//     whyChooseUs: { type: String, required: true },
// });

// module.exports = mongoose.model('About', aboutSchema);


const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    mission: { 
        type: String, 
        required: true 
    },
    offerings: { 
        type: [String], 
        required: true 
    },
    whyChooseUs: { 
        type: String, 
        required: true 
    }
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
