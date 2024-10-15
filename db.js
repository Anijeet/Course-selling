const mongoose=require('mongoose')
console.log("connected")
const Schema=mongoose.Schema
// mongoose.connect("mongodb+srv://anijeetmani18:PQ5mVAgxraNJXNQ4@cluster0.o3f7k.mongodb.net/corsera_app")
const ObjectId = Schema.ObjectId;

const UserSchema =new Schema({
    firstName:String,
    lastName:String,
    email:{type:String,unique:true},
    password:{type:String,required:true},
})

const AdminSchema =new Schema({
    firstname:String,
    secondname:String,
    email:{type:String,unique:true},
    password:{type:String,required:true},
})

const CourseSchema =new Schema({
   title:String,
   description:String,
   price:Number,
   imageurl:String,
   creatorid:ObjectId,
})

const PurchasesSchema =new Schema({
   courseid:String,
   userid:String,
})

const Usermodel=mongoose.model('User',UserSchema)
const Adminmodel=mongoose.model('Admin',AdminSchema)
const Coursemodel=mongoose.model('Course',CourseSchema)
const Purschasemodel=mongoose.model('Purchase',PurchasesSchema)

module.exports={
    Usermodel,
    Purschasemodel,
    Adminmodel,
    Coursemodel
}
