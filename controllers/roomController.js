// controllers/roomController.js
const RoomMessage = require('../models/RoomMessage');

const getRoomMessages = async (req, res) => {
    try {
        const messages = await RoomMessage.find().populate("sender", "username");
        if (messages.length < 1) {
            return res.status(404).json({ message: 'No messages found for this room' });
        }
        return res.json(messages);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const sendRoomMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const sender = req.user._id;
        const message = new RoomMessage({ content, sender });
        await message.save();
        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getRoomMessages, sendRoomMessage };
