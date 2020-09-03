import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CreateMeeting from '../../Pages/createMeeting/createMeeting.components'
import EditMeeting from '../editMeeting/editMeeting.component'
import SeeMeetings from '../seeMeetings/seeMeetings.component'
class MeetingRoutingComponent extends React.Component{
    constructor(props){
        super()
        console.log(this.props)
    }
    render(){
        return(<div>
            <Switch>
                <Route exact path={`${this.props.match.url}/:id/edit`} render={()=><EditMeeting/>} />
                <Route exact  path={`${this.props.match.url}/create`} render={()=><CreateMeeting/>}/>
                <Route exact path={`${this.props.match.url}/:id`} render={()=><SeeMeetings/>}/>  
            </Switch>
        </div>)
    }
}
const mapStateToProps=(state)=>({

})
const dispatchStateToProps=(dispatch)=>({

})
export default withRouter(MeetingRoutingComponent)