const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();

// Register a new user
router.post('/signup', signup);

// Log in
router.post('/login', login);

module.exports = router;
