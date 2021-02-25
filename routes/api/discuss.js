const express = require('express')
const router = express.Router()

const Room = require('../../models/Room')

router.get(
    "/chats/:id",
    async (req, res) => {
        try {
            await Room.findOne({ room: req.params.id })
                .populate('chats').exec((err, chats) => {
                    if (err) {
                        res.status(201).json({
                            error: 'No Chats Found'
                        })
                    }
                    else {
                        res.send(chats.chats)
                    }
                })
        } catch (error) {
            res.status(400).json({
                error: 'No Chats'
            })
        }
    }
);

module.exports = router