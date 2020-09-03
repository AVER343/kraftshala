const jwt = require('jsonwebtoken')
const User = require('../models/user/user')
const auth =async (req,res,next)=>{
    try
    {   
       const token = req.header('Authorization').replace('Bearer ','')
       const decodedUser =await jwt.verify(token,`SECRET_KEY`)
       const user = await User.findOne({_id:decodedUser._id},{meetings:0})
        if(!user)
        {
            throw new Error("UNAUTHORIZED!")
        }
        req.user=user
        req.token=token
        next()
    }
    catch(e)
    {
        let error=''
        if(e.message)
        {
            error=e.message
        }
        else if(e.response){
            error=e.response.data||''
        }
        res.status(400).send({errors:[{error:'Authentication Error!'}]})
    }
}  
module.exports=auth