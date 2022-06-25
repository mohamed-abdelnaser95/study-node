const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: [true, 'author name is require'],
    },
    description: {
        type: String,
        require: [true, 'author description is require'],
    },
    age: {
        type: Number,
        require: [true, 'author age is require'],
    },
})

const Author = mongoose.model("Author", authorSchema)

module.exports = Author
module.exports = authorSchema