const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ISLConnect')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/translate', require('./routes/translate'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/thankyou', require('./routes/thankyouRoutes'));

// About route (fix bad import in aboutRoutes.js)
const About = require('./models/About');
app.get('/api/about', async (req, res) => {
  try {
    let aboutData = await About.findOne();
    if (!aboutData) {
      // Seed default data if none exists
      aboutData = await About.create({
        title: 'About ISL Connect',
        description: 'ISL Connect is a platform for sign language accessibility.',
        mission: 'To bridge the communication gap for the deaf community using sign language technology.',
        offerings: ['Real-time sign language translation', 'YouTube video accessibility', 'Easy integration'],
        whyChooseUs: 'We combine cutting-edge AI with accessibility to empower the deaf community.'
      });
    }
    res.status(200).json(aboutData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching about data' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
