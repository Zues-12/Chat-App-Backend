// controllers/roomController.js
const Room = require('../models/Room');
const Message = require('../models/Message');

const createRoom = async (req, res) => {
    try {
        const { name, members } = req.body;
        let isGroup = false;
        if (!members.includes(req.user._id)) {
            members.push(req.user._id);
        }

        if (members.length > 2) {
            isGroup = true
        }

        const room = new Room({ name, members, isGroup });
        await room.save();
        return res.status(201).json(room);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ members: req.user._id }).populate('members', 'username');
        if (!rooms) {
            return res.json(204).json({ message: 'No rooms found for this user' })
        }
        return res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId);
        if (!room || !room.members.includes(req.user._id)) {
            return res.status(403).json({ error: 'Not authorized to access this room' });
        }
        const messages = await Message.find({ room: roomId }).populate("sender", "username");
        if (messages.length < 1) {
            return res.status(404).json({ message: 'No messages found for this room' });
        }
        return res.json(messages);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { createRoom, getRooms, getRoomMessages };
