const Message = require("../models/Message");

const sendMessage = async (req, res) => {
    // const { roomId } = req.params;
    const { content, roomId } = req.body;
    const sender = req.user._id;
    try {
        const message = new Message({ content, sender, room: roomId });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
}


module.exports = { sendMessage }