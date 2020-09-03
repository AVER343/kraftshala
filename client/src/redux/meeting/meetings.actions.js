import axios from 'axios';
import { ERROR_ADDING } from '../error/error.actions';
import ACTION_TYPES from './meeting.action.types';
import { getJWT } from '../users/users.utils';
export const GETTING_MEETING=()=>({
    type:ACTION_TYPES.GETTING_MEETINGS
})
export const GOT_MEETINGS=(meetings)=>({
    type:ACTION_TYPES.GOT_MEETINGS,
    payload:meetings
})
export const DELETE_MEETINGS=(meetings)=>({
    type:ACTION_TYPES.GOT_MEETINGS,
    payload:meetings
})
export const requestMeetings=()=>{                   
    return async (dispatch) => {
        try{
            let res=await axios(({method: 'GET', url: 'http://localhost:7000/me',headers:{'Authorization':`Bearer ${getJWT()}`}}))
            let response= res.data.meetings.sort((a,b) => (a.meetingTime > b.meetingTime) ? 1 : ((b.meetingTime > a.meetingTime) ? -1 : 0)); 
            if(res.status===200)
            {            
                dispatch(GOT_MEETINGS(response))
            }
            else{
                dispatch(GOT_MEETINGS([]));
            }
        }
        catch(e)
        {
            dispatch(ERROR_ADDING(e.response?e.response.data:'Something went wrong!'))
            
        }
    };
};
export const updateMeeting=(id,dated)=>{
    return async (dispatch) => {
        try{
            const res =await axios({method: 'PATCH', url: `http://localhost:7000/meeting/${id}`,headers:{'Authorization':`Bearer ${getJWT()}`},data:{dated}});
            if(res.status===200)
            {            
                console.log(res.data)
                dispatch(GOT_MEETINGS(res.data.meetings))
            }
            else{
                dispatch(GOT_MEETINGS([]));
            }
        }
        catch(e)
        {
            dispatch(ERROR_ADDING(e.response?e.response.data:'Something went wrong!'))
        }
    };
}
export const DeleteMeeting=(id)=>{
    return async (dispatch) => {
        
        try{
            const res =await axios({method: 'DELETE', url: `http://localhost:7000/meeting/${id}`,headers:{'Authorization':`Bearer ${getJWT()}`}});
            if(res.status===200)
            {       
                console.log(res.data)    
                // dispatch(DELETE_MEETINGS(res.data.meetings))
            }
            else{
                dispatch(GOT_MEETINGS([]));
            }
        }
        catch(e)
        {
            dispatch(ERROR_ADDING(e.response?e.response.data:'Something went wrong!'))
        }
    };
} 
