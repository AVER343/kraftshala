import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import {Alert} from 'react-bootstrap'
import Header from './Components/header/header.component'
import { connect } from 'react-redux'
import HomePage from './Pages/Homepage/homepage';
import SignUpPage from './Pages/SignUp/signup.component';
import SignInPage from './Pages/SignIn/signInAndSignUp.component';
import { ERROR_DELETING,ERROR_ADDING } from './redux/error/error.actions';
import MeetingRoutingComponent from './Components/meetingRouting/meeting.component';
const App= (props)=> { 
 return (<div style={{size: '100%'}}>
    <Header/>
    {props.errors?props.errors.errors.map((elem,idx)=> (<Alert key={idx} variant='danger' onClose={()=>{console.log("close")}} dismissible>
    <b>{elem.error}</b>
  </Alert>)):null}
    <Switch>
      <Route exact path='/' render={()=>props.currentUser?<HomePage/>:<Redirect to='/signin'/>}/>
      <Route exact path='/signin' render={()=>props.currentUser?<Redirect to='/'/>:<SignInPage/>}/>
      <Route exact path='/signup' render={()=>props.currentUser?<Redirect to='/'/>:<SignUpPage/>}/>
      <Route path='/meeting' render={()=>props.currentUser?<MeetingRoutingComponent/>:<SignUpPage/>}/>
    </Switch>
    </div>
  );
}
const mapStateToProps=(state)=>({
  currentUser: state.user,
  errors:state.errors
})
const mapDispatchToProps =(dispatch)=>({
  ERROR_DELETING:()=>dispatch(ERROR_DELETING()),
  ERROR_ADDING:()=>dispatch(ERROR_ADDING())
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
