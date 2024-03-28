const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    collectionId: { type: String, required: true }
})

const Like = mongoose.model('Like', likeSchema)

module.exports = Like
