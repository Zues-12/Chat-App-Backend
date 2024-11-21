const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const messageRoutes = require('./messageRoutes');

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);

module.exports = router;
