import ACTION_TYPES from './meeting.action.types'
const INITIAL_STATE={
    meetings:[],
    loading:false
}
const MeetingReducer = (state=INITIAL_STATE,action)=>{
    switch (action.type)
    {
        case ACTION_TYPES.GETTING_MEETINGS:
            return {loading:true}
        case ACTION_TYPES.GOT_MEETINGS:
            return {meetings:action.payload,loading:false}
        default:
            return state;
    }
}
export default MeetingReducer