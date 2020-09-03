import { Input, makeStyles } from '@material-ui/core'
import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import FormInput from '../../Components/form-input/form-input.component';
import CustomButton from '../../Components/custom-button/custom-button.component';
import { withRouter } from 'react-router-dom';
import { ERROR_ADDING } from '../../redux/error/error.actions';
import { connect } from 'react-redux';
import { getJWT } from '../../redux/users/users.utils';
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
class CreateMeeting extends React.Component{
    constructor(props){
        super(props)
        this.state={
            users:[],
            email:'',
            title:'',
            date: new Date()
        }
    }
   async componentDidMount(){
   const users= await axios({url:'http://localhost:7000/users',method:"GET"})
    await this.setState({users:users.data})
    }
    handleChange=async(event)=>{
        const {name,value}=event.target
        this.setState({[name]:value})
    }
    handleSubmit=async()=>{
        try{   
           const res= await axios({url:`http://localhost:7000/meeting`,headers:{'Authorization':`Bearer ${getJWT()}`},method:'POST',data:{
                description:this.state.title,
                dated:this.state.date,
                emails:[this.state.email||this.state.users[0].email]}})
            console.log(res)   
            if(res.status==201)
            {
                alert('Meeting Successfully created !')
                this.props.history.push('/')
            }
        }
        catch(e){
            this.props.errors(e.response.data)
        }
    }
    render(){
        const classes =makeStyles()
        return(<div>
        <FormInput  label='Title' value={this.state.title}  onChange={this.handleChange} name="title"/>
        <TextField
            id="datetime-local"
            label="Next appointment"
            type="datetime-local"
            name="date"
            className={classes.textField}
            onChange={this.handleChange}
            value={this.state.date}
            InputLabelProps={{
            shrink: true,
            }}
        />
       <label style={{marginLeft:'50px'}} for="cars">Select User:</label>
        <select style={{width:'300px'}} name="dropdown" id="users" onChange={(event)=>this.setState({email:event.target.value})}>
                {this.state.users.length>0?this.state.users.map((elem,index)=><option key={index} value={elem.email} >{elem.name}</option>):null}
        </select>
        <CustomButton onClick={this.handleSubmit} style={{marginTop:'50px'}}>Submit</CustomButton>
    </div>)}
}
const mapdispatchToProps=(dispatch)=>({
errors:(error)=>dispatch(ERROR_ADDING(error))
})
export default withRouter(connect(null,mapdispatchToProps)(CreateMeeting))