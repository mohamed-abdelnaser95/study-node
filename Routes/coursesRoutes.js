const express = require('express')
const route = express.Router()
const joi = require('joi');
// const { find } = require('../Schema/coursesSchema');
const Courses = require('../Schema/coursesSchema')
const _ = require("lodash")
// app.use(express.json()) // this is very important to add and update

// Get all courses
route.get('/', async (req, res)=> {
    try{
        const allCourses = await Courses.find()
        if(!allCourses){
            throw new Error("data not found")
        }
        res.send({
            state: "data find successfully",
            data: allCourses
        })
    }catch(err){
        res.send({
            state: "error to find data, from catch",
            error: err.message
        })
    }
});

// Get one course by id
route.get('/:id', async (req, res)=> {
    try{
        const findCourse = await Courses.findById(req.params.id)
        if(!findCourse){
            throw new Error("Course is not found")
        }
        res.send({
            state: 'course found',
            data: findCourse
        })
    }catch(err){
        res.send({
            state: "error to find the course",
            error: err.message
        })
    }
})

// Update course data
route.patch('/:id', async (req, res)=> {
    try{
        // if i did not write await before Courses.findByIdAndUpdate it will not find course
        const findCourse = await Courses.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true, runValidators: true }) // new: true is write to return the data with updated value not the old
        // findCourse.save() // no need to write the save function cus findbyidandupdate will make save
        if(!findCourse){
            throw new Error("course is not found")
        }
        res.send({
            state: "data is updated",
            result: findCourse
        })
    }catch(err){
        res.send({
            state: "error to update data",
            error: err.message
        })
    }

})

// Add new course data
route.post('/', async (req, res)=> {
    try{
        const newCourse = new Courses(_.pick(req.body, ["name", "description", "grade", "finish", "teacher"]))

        // without save() data will not save in database
        await newCourse.save()
        res.send({
            state: 'new course is added',
            data : (_.pick(newCourse, ["name", "description", "grade"]))
            // this will return to user the new ueser formed but only the data i detected
        })
    }catch(err){
        res.send({
            state: 'something went wrong during add the course',
            error: err.message
        })
    }
})

// Delete course from data
route.delete('/:id', async (req, res) => {
    try{
        const findCourse = await Courses.findByIdAndRemove({_id: req.params.id})
        if(!findCourse){
            throw new Error("course is not found")
        }

        res.send({
            state: "course is deleted sucessfully",
            courseDeleted: findCourse
        })
    }catch(err){
        res.send({
            state: "error to delete the course",
            error: err.message
        })
    }
})


module.exports = route