import Axios from 'axios'
import React, { PureComponent } from 'react'
import {Table} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
const TableComponent=(props)=>{
  return(<Table striped bordered hover>
      {props.meetings?<thead>
      <tr>
        <th>#</th>
        <th>Meeting Title</th>
        <th>On (DD-MM-YYYY)</th>
        <th>Time</th>
      </tr>
    {props.meetings.map((elem,index)=>{
      const date = new Date(elem.meetingTime)
      return(<tr key={index} onClick={()=>props.history.push(`/meeting/${props.meetings[index]._id}`)}>
        <th  scope="row">{index}</th>
        <td>{elem.description}</td>
        <td>{date.getDate()<10?'0'+date.getDate():date.getDate()}-{date.getMonth()<10?'0'+date.getMonth():date.getMonth()}-{date.getFullYear()} </td>
        <td>{ new Intl.DateTimeFormat('default',{  hour12: true, hour: 'numeric', minute: 'numeric'})      
            .format(date)}
          </td>
      </tr>)
    })}
    </thead>:null}
  </Table>)
}
export default withRouter(TableComponent)