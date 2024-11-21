const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddelware');
const { getRoomMessages, sendRoomMessage } = require('../controllers/roomController');


router.get('/', protect, getRoomMessages);
router.post('/', protect, sendRoomMessage);

module.exports = router;

