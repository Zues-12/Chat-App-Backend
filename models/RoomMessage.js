const { default: mongoose } = require("mongoose");

const roomMessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model('RoomMessage', roomMessageSchema)