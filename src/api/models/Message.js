const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)