const express = require('express')
const router = new express.Router();
const auth= require('../../middlewares/auth')
const jwt = require('jsonwebtoken')
const User= require('../../models/user/user')
router.post('/signup',async (req,res) => {
    let errors=[]
  try{ 
    const {password,email,name} = req.body
    if(password.toString().length<8)
    {
       errors.push({error:'Password needs to have more than 7 characters !'})
    }
    const existing = await User.findOne({email})
    if(existing)
    {
        errors.push({error:'Email already in use.'})
    }
    if(errors){
        return res.status(400).send({errors})    }
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
router.get('/me',auth,(req,res)=>{
   res.send({user:req.user,token:req.token})
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
    req.user.tokens=req.user.tokens.filter(token=>token.token!=req.token)
    req.token=''
    await req.user.save()
    res.send({user:'',token:''})
})
router.post('/logout/all',auth,async (req,res)=>{
    req.user.tokens=[]
    req.token=''
    await req.user.save()
    res.send({user:'',token:''})
})
module.exports= router