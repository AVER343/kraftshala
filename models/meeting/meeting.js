const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Date,
        default: new Date()
    },
    meetings: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
}, {
    timestamps: true
})
Meeting.methods.toJSON=function(){
    const meeting =this
    const meetingObject= meeting.toObject()
    delete meetingObject.__v
    return meetingObject
}
const Meeting = mongoose.model('Meeting', MeetingSchema)

module.exports = Meeting