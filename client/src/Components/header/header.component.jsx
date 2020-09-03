import React from 'react';
import {
  withRouter, Link, Redirect
} from 'react-router-dom'
import {
  HeaderContainer,
  OptionsContainer,
  OptionLink
} from './header.styles';
import { connect } from 'react-redux';
import { asyncLogOut } from '../../redux/users/users.actions';
const Header = (props) => (
  <HeaderContainer >
    <OptionsContainer >
     {props.currentUser?<OptionLink to='/meeting/create'>Create Meeting</OptionLink>:null}
     {props.currentUser?null:<OptionLink to='/signup'>SIGN UP</OptionLink>}
      {props.currentUser?(
        <OptionLink as='div' onClick={() =>{props.LOGOUT(props.currentUser.token)}}>
         <Link to='/signin'> SIGN OUT</Link>
          </OptionLink>
      ) : (<OptionLink to='/signin'>SIGN IN</OptionLink>)}
    </OptionsContainer> 
    {props.currentUser?<div style={{marginRight:'225px',marginTop:'1.5rem'}}>NAME : {props.currentUser.name.toUpperCase()}</div>:null}
     </HeaderContainer>
);

const mapStateToProps=(state)=>({
      currentUser : state.user
})
const mapDispatchToProps=dispatch =>({
      LOGOUT:token=>dispatch(asyncLogOut(token))
})

export default connect(mapStateToProps,mapDispatchToProps)(Header);
