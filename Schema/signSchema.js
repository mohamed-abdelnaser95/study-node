const mongoose = require('mongoose')
const Schema = mongoose.Schema
const joi = require('joi');
const jwt = require('jsonwebtoken')

const SigninSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'course name is require'],
        min: 3,
        max: 44,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'course name is require'],
        min: 3,
        max: 255,
    },
    password: {
        type: String,
        required: [true, 'course name is require'],
        min: 8,
        max: 1024,
    },
})

SigninSchema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id}, 'privatekey')
    return token
}

const Signin = mongoose.model("Signin", SigninSchema)

// this way will say joi.validate is not a function
// function signinValidate(user){
//     const schema = joi.object({
//         fullName: joi.string().required(),
//         email: joi.string().required().email(),
//         password: joi.string().min(8).max(1024).required(),
//     })
//     return joi.validate(user, schema)
// }

// the right way is
function signinValidate(user){
    const schema = joi.object({
        fullName: joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().min(8).max(1024).required(),
    })
    return schema.validate(user)
}


exports.Signin = Signin
exports.signinValidate = signinValidate;