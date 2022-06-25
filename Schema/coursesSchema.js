const teacherSchema = require('./teacherSchema')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'course name is require'],
    },
    description: {
        type: String,
        required: [true, 'course name is require'],
    },
    grade: {
        type: Number,
        required: [true, 'course name is require'],
    },
    finished: {
        type: Boolean,
        required: false,
        default: true
    },
    teacher: {
        type: teacherSchema,
        required: true,
    }

})

const Courses = mongoose.model("Course", courseSchema)
module.exports = Courses