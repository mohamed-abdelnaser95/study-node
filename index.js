const CoursesRouter = require('./Routes/coursesRoutes')
const userSignin = require('./Routes/userRoutes')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json()) // this is very important to add and update to turn the input data into json
// const joi = require('joi')


mongoose.connect('mongodb://localhost:27017/courses', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    console.log("Connected successfully to database")
}).catch((err)=> {
    console.log({
        message: "Error to connect to database",
        error: err
    })
})

app.use('/user', userSignin)

app.use('/courses', CoursesRouter)

app.get('/', (req, res)=> {
    res.send('welcome to my portfolio')
});


app.get('/cv', (req, res)=> {
    res.send('welcome to my cv')
})

// this is wildcard API to handle the wrong url
app.get("*", (req, res) => {
    throw new Error("sorry, this is invalid url");
});


const port = process.env.port = 4000 || 3000;
app.listen(port, ()=> {
    console.log(`App listening on port ${port}....`)
}) 
