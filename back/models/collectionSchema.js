const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    createdDate: { type: Date, required: true },
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    likes: { type: Number, required: true }
})

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection