const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    image: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', postSchema)