const express=require('express')
const {z}=require('zod')
const bcrypt=require('bcrypt')
const { Usermodel, Purschasemodel, Coursemodel } = require('../db')
const UserRouter=express.Router()
const jwt=require('jsonwebtoken')
const {JWT_USER_SECRET}=require('../config')
const { userMiddleware }=require('../middleware/user')


UserRouter.post('/signup',async function(req,res){
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB
// Zod schema for validating user input
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Adjust the minimum length as needed
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
        await Usermodel.create({
        
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
      } catch (error) {
        console.error(error);
        throwerror=true;
        res.status(500).json({
          message: "User already exists",
        });
      }
      if(!throwerror){ 
        res.json({
            message: "You are signed up"
        })
    }
})
UserRouter.post('/signin',async function(req,res){
    const { email, password }=req.body;
    const user=await Usermodel.findOne({
        email
    })

    try{
    const passwordmatch=bcrypt.compare(password,user.password)
    if(passwordmatch){
        const token=jwt.sign({
            id:user._id.toString()  
        },JWT_USER_SECRET);

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
UserRouter.get('/purschases',userMiddleware,async function(req,res){
  const userid=req.userId
  const purchases=await Purschasemodel.find({
    userid
  })
  let purchasedCourseIds = [];

  for (let i = 0; i<purchases.length;i++){ 
      purchasedCourseIds.push(purchases[i].courseid)
  }

  const courseData= await Coursemodel.find({
    _id: { $in:purchasedCourseIds}
  })
    res.json({
      purchases,
      courseData
    })
})
module.exports={
    UserRouter:UserRouter
}