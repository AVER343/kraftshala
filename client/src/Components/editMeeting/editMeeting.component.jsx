import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { connect } from 'react-redux';
import { requestMeetings, updateMeeting } from '../../redux/meeting/meetings.actions';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { getJWT } from '../../redux/users/users.utils';
import { ERROR_ADDING } from '../../redux/error/error.actions';
import { Redirect, withRouter } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function EditMeeting(props) {
  const handleDelete =async ()=>{
  try{
      const res=await axios({url:`http://localhost:7000/meeting/${props.match.url.split('/')[2]}`,headers:{'Authorization':`Bearer ${getJWT()}`},method:'DELETE'})
      if(res.status==200)
      {
        alert('Meeting Deleted');
        props.history.push('/')
      }
      console.log(res)
    }
      catch(e){ 
        props.errors(e.response.data)
      }
   }
  const handleSubmit=async()=>{
       props.updateMeeting(props.match.url.split('/')[2],dated)
       props.requestMeetings()
    }
  const classes = useStyles();
  const [dated,setDated] = useState('')
  return (
    <form className={classes.container} Validate style={{margin:'50px'}}>
      <TextField
        id="datetime-local"
        label="Next appointment"
        type="datetime-local"
        onChange={(event)=>setDated(event.target.value)}
        value={dated}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button onClick={handleSubmit}>Submit</Button>
      <Button onClick={handleDelete}>Exit Meeting</Button>
    </form>
  );
}
const mapStateToProps=(state)=>({
    email:state.user.email,
    meetings:state.meetings
})
const dispatchToProps=dispatch=>({
    updateMeeting:(id,time)=>dispatch(updateMeeting((id),time)),
    errors:(e)=>dispatch(ERROR_ADDING(e)),
    requestMeetings:()=>dispatch(requestMeetings())
})
export default withRouter(connect(mapStateToProps,dispatchToProps)(EditMeeting))