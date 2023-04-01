const mongoose = require('mongoose')

const { Schema } = mongoose;

const NotesSchema = new Schema({
    notes: {
        type: String,
        requied: true
    },
    description: {
        type: String,
        requied: true
    },
    tag: {
        type: String,
        default: 'General'
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('notes', NotesSchema)