const express = require('express')
const router = new express.Router();
const auth= require('../../middlewares/auth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User= require('../../models/user/user')
router.post('/signup',async (req,res) => {
    let errors=[]
  try{ 
    const {password,email,name,confirmPassword} = req.body
    if(password.toString()!==confirmPassword.toString())
    {
       errors.push({error:'Password and Confirm password needs to be same.'})
    }
    if(password.toString().length<8)
    {
       errors.push({error:'Password needs to have more than 7 characters !'})
    }
    const existing = await User.findOne({email})
    if(existing)
    {
        errors.push({error:'Email already in use.'})
    }
    if(errors.length>0){
        return res.status(400).send({errors})    
        }
    const user = await new User({password,email,name})
    const token = await user.generateJWT()
    res.status(200).send({user,token})
}
catch(e)
    {
        console.log(e.response.data)
        res.status(400).send({errors:[{error:e.response.data}]})
    }
})
router.get('/me',auth,async(req,res)=>{
    
    let userdetails =await User.findOne({_id:mongoose.Types.ObjectId(req.user._id)}).sort('meetings.meetingTime').populate({path:'meetings',select:'-__v -people'}).exec()
     res.send({user:req.user,token:req.token,meetings:userdetails.meetings})
})
router.post('/login',async (req,res)=>{
    try
    {
        const {email,password} = req.body
        const user = await User.findByCredentials(email,password)
        const token = await user.generateJWT()
        res.send({user,token})
    }
    catch(e)
    {
        res.status(400).send({errors:[{error:e.message}]})
    }
})
router.get('/all',async (req,res) =>{
   try{ 
        const users= await User.find()
        res.send({users})
    }
   catch(e)
   {
       res.status(400).send(e)
   }
})
router.post('/logout',auth,async(req,res)=>{
    req.token=''
    await req.user.save()
    res.send({user:'',token:''})
})
router.post('/logout/all',auth,async (req,res)=>{
    req.token=''
    await req.user.save()
    res.send({user:'',token:''})
})
router.get('/users',async(req,res)=>{
    const users= await User.find({})
    res.send(users.map(elem=>{return {email:elem.email,name:elem.name}}))
})
module.exports= router