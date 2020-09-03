const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    meetingTime: {
        type: Date,
        default: new Date()
    },
    people: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
}, {
    timestamps: true
})
meetingSchema.methods.toJSON=function(){
    const meeting =this
    const meetingObject= meeting.toObject()
    delete meetingObject.__v
    return meetingObject
}

const Meeting = mongoose.model('Meeting', meetingSchema)

module.exports = Meeting