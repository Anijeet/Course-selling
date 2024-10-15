const {Router}=require('express')
const CourseRouter=Router()
const{ userMiddleware }=require('../middleware/user')
const { Purschasemodel,Coursemodel}=require('../db')

CourseRouter.post('/purchase', userMiddleware,async function(req,res){ //user want to purchase the course
    const userid=req.userID
    const courseid=req.body.courseid
    await Purschasemodel.create({
        userid,
        courseid
    })
    res.json({
        message:"You succefully purchased the course"
    })
})
CourseRouter.get('/preview',async function(req,res){
    const courses = await Coursemodel.find({});
    res.json({
        courses
    })
})
module.exports={
    CourseRouter:CourseRouter
}