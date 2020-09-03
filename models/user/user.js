const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcryptjs')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
        trim:true,
        validate(value) {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password is weak!')
            }
        }
    },
    meetings: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Meeting'
            }]
}, {
  toObject: {
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
  })
UserSchema.methods.toJSON=function(){
    const user =this
    const userObject= user.toObject()
    delete userObject._id
    delete userObject.__v
    delete userObject.password
    return userObject
}
UserSchema.statics.findByCredentials=async function(email,password){
  try{
        const credentials= await User.findOne({email})
        const isMatch = await bcrypt.compare(password,credentials.password)
        if (!isMatch) {
        throw new Error('Invalid Credentials !')
        }
    return credentials
    }
    catch(e){
        throw new Error('Invalid Credentials !')
    }
}
UserSchema.methods.generateJWT =async function(){
    try
    {
        const user = this
        const JWToken =await jwt.sign({_id: user._id},`SECRET_KEY`)
        await user.save()
        return JWToken
    }
    catch(e)
    {
        console.log(e)
    }
}
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User=mongoose.model('User',UserSchema)
module.exports=User