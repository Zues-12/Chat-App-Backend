const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
    const { content, receiver } = req.body;
    const sender = req.user._id;
    try {
        const message = new Message({ content, sender, receiver });
        await message.save();
        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message" });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const { receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { receiver: receiver, sender: req.user._id },
                { sender: receiver, receiver: req.user._id }
            ]
        }).populate("sender", "username");

        if (messages.length < 1) {
            return res.status(404).json({ message: 'No messages found' });
        }

        return res.status(201).json(messages);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
