import axios from 'axios';
import React from 'react'
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom';
import { ERROR_ADDING } from '../../redux/error/error.actions';
import { getJWT } from '../../redux/users/users.utils';
let date
class SeeMeetings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            meeting:''
        }
    }
    async componentDidMount(){
       try{
        let url = this.props.match.url
        url=url.split('/').filter(elem=>elem.length>0)
         let res=await axios(({method: 'GET', url: `http://localhost:7000/meeting/${url[1]}`,headers:{'Authorization':`Bearer ${getJWT()}`}}))
         await this.setState({meeting:res.data.meeting})
        date= new Date(this.state.meeting.meetingTime)
      }
      catch(e){
        this.props.ERROR_ADDING(e.response.data)
      }
        }
  render(){
    return(<div>
        <table className="table table-dark">
        <thead>
          <tr>
            <th scope="col">Meeting time</th>
            <th scope="col">Description</th>
            <th scope="col">Invited email</th>
            <th scope="col">Invited name</th>
          </tr>
        </thead>
        <tbody>
            {this.state.meeting?this.state.meeting.people.map((elem,index)=>{
              let daten=new Date(this.state.meeting.meetingTime)
              return(<tr key={index}>
                <td scope="row">{daten.toString()}</td>
                    <td>{this.state.meeting.description}</td>
                    <td scope="row">{elem.email}</td>
                    <td>{elem.name}</td>
                    </tr>)
            }):null}
        </tbody>
        </table>
        <Button onClick={()=>this.props.history.push(`${this.props.match.url}/edit`)}>Edit</Button>
        </div>)
  }
}
const mapStateToProps =(state)=>({
    meetings:state.meetings
})
const dispatchStateToProps=dispatch=>({
  ERROR_ADDING:(error)=>dispatch(ERROR_ADDING(error))
})
export default withRouter(connect(mapStateToProps,dispatchStateToProps)(SeeMeetings))
