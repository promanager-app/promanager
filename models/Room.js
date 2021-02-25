const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const roomSchema = new mongoose.Schema(
    {
        room: String,
        chats: [{
            type: ObjectId,
            ref: 'Chat'
        }]
    }
)

module.exports = mongoose.model('Room', roomSchema)
