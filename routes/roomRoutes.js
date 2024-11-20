const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddelware');
const { createRoom, getRooms, getRoomMessages } = require('../controllers/roomController');

router.post('/createRoom', protect, createRoom);
router.get('/getRooms', protect, getRooms);
router.get('/:roomId', protect, getRoomMessages);

module.exports = router;

