const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddelware');
const { sendMessage, getMessages, readMessage } = require('../controllers/messageController');

router.post('/', protect, sendMessage)
router.get('/:receiver', protect, getMessages)
router.post('/markAsRead', protect, readMessage)

module.exports = router;