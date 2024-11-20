const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const messageRoutes = require('./messageRoutes');
const roomRoutes = require('./roomRoutes');

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);
router.use('/room', roomRoutes);

module.exports = router;
