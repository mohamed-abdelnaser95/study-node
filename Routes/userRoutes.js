const express = require('express')
const route = express.Router()
const { Signin, signinValidate } = require('../Schema/signSchema')
const _ = require("lodash")
const bcrypt = require('bcrypt')
const joi = require('joi');
const auth = require('../middleware/auth')
// const jwt = require('jsonwebtoken')

route.get('/', async (req, res)=> {
    try{
        const allUsers = await Signin.find()
        if(!allUsers){
            throw new Error("data not found")
        }
        res.send({
            state: "data find successfully",
            data: allUsers
        })
    }catch(err){
        res.send({
            state: "error to find data, from catch",
            error: err.message
        })
    }
});

route.post('/signup', auth, async (req, res)=> {
    try{
        const { error } = signinValidate(req.body)
        if(error){
            return res.status(404).send(error.details[0].message) 
        }
        const user = await Signin.findOne({email: req.body.email})
        if(user){
            return res.status(404).send("user is found in database")
        }
        const newUser = new Signin({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })

        // here will take only fullName, email and password
        // const user = new Signin(_.pick(req.body, ['fullName', 'email', 'password']))

        const saltRounds = 10;
        newUser.password = await bcrypt.hash(newUser.password, saltRounds)
        await newUser.save()
        const token = newUser.generateToken()
        res.header('x-auth-token', token).send({
            data: _.pick(newUser, ['_id', 'fullName', 'email']),
            token: token
        })
    }catch(err){
        res.send({
            state: "error to save user",
            error: err.message
        })
    }
})

route.post('/signin', async (req, res)=> {
    try{
        function validate(req){
            const schema = joi.object({
                email: joi.string().required().email(),
                password: joi.string().min(8).max(1024).required(),
            })
            return schema.validate(req)
        }

        const { error } = validate(req.body)
        if(error){
            return res.status(404).send(error.details[0].message) 
        }

        let user = await Signin.findOne({email: req.body.email})
        if(!user){
            return res.status(404).send("invalid email or password from find user ")
        }

        // const getPass = req.body.password // evil way to get password before hashed it
        const checkPassword = await bcrypt.compare(req.body.password, user.password)
        if(!checkPassword){
            return res.status(404).send("invalid email or password")
        }
        // const token = jwt.sign({_id : user._id}, 'privateKey')
        const token = user.generateToken()

        res.send({
            statue: "successfully signin", 
            token: token,
            // pass : getPass
        })
    }catch(err){
        res.send({
            state: "error signin",
            error: err.message
        })
    }
})

route.delete('/:id', auth, async(req, res)=> {
    try{
        let user = await Signin.findByIdAndRemove({_id : req.params.id})
        if(!user){
            throw new Error("user is not found")
        }
        res.send({
            status: 'user is deleted',
            dataDeleted: user
        })
    }catch(err){
        res.send({
            status: 'error to delete user',
            error: err.message
        })
    }
})

module.exports = route
