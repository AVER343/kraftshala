const express = require('express')
const mongoose = require('mongoose')
const router = new express.Router();
const auth= require('../../middlewares/auth')
const jwt = require('jsonwebtoken')
const User= require('../../models/user/user')
const Meeting= require('../../models/meeting/meeting')
router.get('/meeting/all',auth,async(req,res)=>{
    const meetingData= await Meeting.find({}).sort({ meetingTime:-1}).populate({path:'people',select:'-meetings'})
    res.send({meeting:meetingData})
})
router.post('/meeting',auth,async(req,res)=>{
  try{  
        const {description,emails,dated} = req.body
        console.log(description,emails,dated)
        if(!description||!emails||!dated)
        {
            return res.status(400).send({errors:[{error:'Empty fields are not allowed !'}]})
        }
        let possible=true
        let meetingDetails=[]
        let memberDetails=[]
        let DateObj =Date.parse(dated)
        let LastDateObj = DateObj + 3600000
        /// checking for emails in database
        const member= await User.findOne({email:emails[0]});
        if(!member)
        {
           res.send({errors:[{error:'Email provided doesn\'t exists'}]})
        }
        memberDetails.push(`${member._id}`)        

                ////get all meetings of the memmbers in array of emails
        await Promise.all(member.meetings.map(async elem=>{
                       const meetingDetail= await Meeting.findById(mongoose.Types.ObjectId(elem));
                       meetingDetails.push(meetingDetail)
                }))
        
        meetingDetails.map(elem=>{
           if(Date.parse(elem.meetingTime)<DateObj)
           {
               if(DateObj-Date.parse(elem.meetingTime)<3600000)
               {
                    possible=false;
               }
           }
          else if(Date.parse(elem.meetingTime)>=DateObj)
           {
               if(Date.parse(elem.meetingTime)-DateObj<3600000)
               {
                    possible=false
               }
           }
        })
        if(!possible){
            return res.status(400).send({errors:[{error:'Slot not available !'}]})
        }
        await memberDetails.push(req.user.id)
        let meeting = new Meeting({description,meetingTime:DateObj,people:memberDetails})
        await meeting.save()
        //saving to meeting of each member in database
         await Promise.all(meeting.people.map(async (elem) => {
                                   const member= await User.findOne({_id:mongoose.Types.ObjectId(elem)});
                                    member.meetings.push(meeting._id)
                                   await member.save()
                                    }));        
        res.status(201).send(meeting)
    }
    catch(e){
        console.log(e)
    }
})
router.get('/meeting/:id',async(req,res)=>{
   try{
    let _id= req.params.id
    const meetingData= await Meeting.findOne({_id}).populate({path:'people',select:'-meetings'}).exec()
    res.send({meeting:meetingData})
    }
    catch(e){
        res.status(400).send({errors:[{error:e.message}]})
    }
})
router.patch('/meeting/:id',auth,async(req,res)=>{
    try{
        const {dated} = req.body
        let possible =true
        let meetingDetails=[]
        let memberDetails=[]
        const _id = req.params.id
        let DateObj =Date.parse(dated)
        if(DateObj<Date.now())
        {
            return res.send({errors:[{error:'Cannot setup meetings in past.'}]})
        }
        let meeting= await Meeting.findOne({_id})
        meeting.people=meeting.people.filter(elem=>elem!=req.user.id)
        const member= await User.findOne({_id:mongoose.Types.ObjectId(meeting.people[0].toString())});
        if(!member)
        {
          return res.send({errors:[{error:'Email provided doesn\'t exists'}]})
        }
        memberDetails.push(`${member._id}`)        

                ////get all meetings of the memmbers in array of emails
        await Promise.all(member.meetings.map(async elem=>{
                       const meetingDetail= await Meeting.findById(mongoose.Types.ObjectId(elem));
                       meetingDetails.push(meetingDetail)
                }))
        
        meetingDetails.map(elem=>{
           if(Date.parse(elem.meetingTime)<DateObj)
           {
               if(DateObj-Date.parse(elem.meetingTime)<3600000)
               {
                    possible=false;
               }
           }
          else if(Date.parse(elem.meetingTime)>=DateObj)
           {
               if(Date.parse(elem.meetingTime)-DateObj<3600000)
               {
                    possible=false
               }
           }
        })
        if(!possible){
            return res.status(400).send({errors:[{error:'Slot not available !'}]})
        }
        meeting= await Meeting.findOneAndUpdate({_id},{meetingTime:DateObj})
        res.send({meeting})
    }
    catch(e){
        return res.status(400).send({errors:[{error:e.message}]})
    }
})
router.get('/delete/all',async(req,res)=>{
   await User.deleteMany()
   await Meeting.deleteMany()
})
router.delete('/meeting/:id',auth,async(req,res)=>{
    const id = req.params.id
    const meetingData= await Meeting.findOne({_id:id},).populate({path:'people',select:'email'}).exec()
    const user=await User.findById({_id:req.user.id})

    meetingData.people = meetingData.people.filter(elem=>elem.email!=user.email)
    await meetingData.save()
    user.meetings = user.meetings.filter(elem=>id!=elem)
    await user.save()
    const meetingsALL= await Meeting.find({}).sort({ meetingTime:-1}).populate({path:'people',select:'-meetings'})
    res.send({user})
})
module.exports = router