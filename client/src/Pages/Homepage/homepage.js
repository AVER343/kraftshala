import React from 'react'
import './homepage.styles.css'
import axios from 'axios'
import { Redirect, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { getJWT } from '../../redux/users/users.utils'
import TableComponent from '../../Components/table/table'
import { requestMeetings } from '../../redux/meeting/meetings.actions'
class HomePage  extends React.Component{
    constructor(props)
 {
   super(props)
   this.state={
       meetings:[]
   }
 }
 async componentDidMount(){
    await this.props.requestMeetings()
}
    render(){
            return(<div><TableComponent meetings={this.props.meetings}/></div>)
            }
}
const mapStateToProps=(state)=>({
    currentUser:state.user,
    meetings:state.meetings.meetings
})
const dispatchStateToProps=dispatch=>({
    requestMeetings:()=>{dispatch(requestMeetings())}
})
export default withRouter(connect(mapStateToProps,dispatchStateToProps)(HomePage))