

const Message = require("../models/Message");

/**
 * Creates a new message and saves it to the database.
 *
 * @param {Object} req - The request object containing the message content and receiver ID.
 * @param {Object} res - The response object.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void>}
 */

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

/**
 * Retrieves messages between the current user and the specified receiver.
 *
 * @param {Object} req - The request object containing the receiver ID.
 * @param {Object} res - The response object with all messages where the user and receiver are either the sender or the receiver.
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void>}
 */

exports.getMessages = async (req, res) => {
    try {
        const { receiver } = req.params;


        await Message.updateMany({ receiver: req.user?._id, sender: receiver, isRead: false }, { $set: { isRead: true } })

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

exports.readMessage = async (req, res) => {
    try {
        const { receiver } = req.body;
        await Message.updateMany({ sender: req.user?._id, receiver: receiver, isRead: false }, { $set: { isRead: true } })
        res.status(200)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
