const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddelware');
const { sendMessage } = require('../controllers/messageController');

router.post('/', protect, sendMessage)

module.exports = router;