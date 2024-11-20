const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddelware');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/', protect, sendMessage)
router.get('/:receiver', protect, getMessages)

module.exports = router;