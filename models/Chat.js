const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const chatSchema = new mongoose.Schema(
    {
        sender: String,
        message: String,
        username: String,
        date: { 
            type: String,
            default: Date.now
        },
        room: {
            type: ObjectId,
            ref: 'Room'
        }
    }
)

module.exports = mongoose.model('Chat', chatSchema)