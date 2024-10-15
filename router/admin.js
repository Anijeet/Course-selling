const { Router }=require('express')
const {z}=require('zod')
const bcrypt=require("bcrypt")
const AdminRouter=Router()
const {Adminmodel, Coursemodel}=require('../db')
const jwt =require('jsonwebtoken')
const {JWT_ADMIN_SECRET}=require('../config')
const { adminMiddleware }=require('../middleware/admin')

AdminRouter.post('/signup',async function(req,res){
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB
// Zod schema for validating user input
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
})
const parseddatawithsuccess=signupSchema.safeParse(req.body)

if(!parseddatawithsuccess.success){
   return res.status(400).json({
    msg:"Invalid input",
    error:parseddatawithsuccess.error//give what's the error on the input
   })
}
let throwerror=false;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create user in the database
        await Adminmodel.create({
        
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
      } catch (error) {
        console.error(error);
        throwerror=true;
        res.status(500).json({
          message: "An error occurred during signup",
        });
      }
      if(!throwerror){ 
        res.json({
            message: "You are signed up"
        })
    }
})
AdminRouter.post('/signin',async function(req,res){
    const { email, password }=req.body;
    const admin=await Adminmodel.findOne({
        email
    })
    try{
    const passwordmatch=bcrypt.compare(password,admin.password)
    if(passwordmatch){
        const token=jwt.sign({
            id:admin._id.toString()  
        },JWT_ADMIN_SECRET);

        res.json({
            token: token
        })
    }
}catch (error) {
    res.status(403).json({
      message: "Invalid email or password",
    });
  }
})
AdminRouter.post('/course',adminMiddleware, async function(req,res){
  const adminid=req.userID

  const{ title,description,imageurl,price }=req.body
  const course=await Coursemodel.create({
    title,
    description,
    imageurl,
    price,
    creatorid:adminid
  })

  res.json({
    message:"Course created",
    courseID:course._id
  })
})
AdminRouter.put('/course',adminMiddleware,async function(req,res){//to change the anything in the course
  const adminid=req.userID

  const{ title,description,imageurl,price,courseID }=req.body
  const course=await Coursemodel.updateOne({
    _id:courseID,
    creatorid:adminid
  }, { title,
       description,
       imageurl,
       price
  })

  res.json({
    message:"Course created",
    courseID:course._id
  })
})
AdminRouter.get('/course/bulk',adminMiddleware,async function(req,res){
  adminid=req.userID
  const courses=await Coursemodel.find({
    creatorid:adminid
  })

  res.json({
   courses
  })
})
module.exports={
    AdminRouter:AdminRouter
}