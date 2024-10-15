require('dotenv').config()
console.log(process.env.mongodburl)
const express=require('express')
const mongoose=require('mongoose')
const { UserRouter }=require('./router/user.js')
const { CourseRouter}=require('./router/course.js')
const { AdminRouter }=require('./router/admin.js')
const app=express()
app.use(express.json())

app.use('/api/v1/admin',AdminRouter)
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/course',CourseRouter)

async function main(){
    mongoose.connect(process.env.mongodburl)//if backend doesnot connect to mongo db then the system otherwise the user put the input but the mongo doesn't get data
    app.listen(3000)
    console.log('listening to port 3000')
}
main()