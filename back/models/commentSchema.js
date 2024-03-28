const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    createdDate: { type: Date, required: true },
    collectionId: { type: String, required: true },
    comment: { type: String, required: true }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment