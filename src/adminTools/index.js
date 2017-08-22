import React from 'react';
import cookie from 'react-cookies'

import s from './style.css';
import pageConfig from '../pageProps.json';
import SignUp from '../../components/SignUp';
import LobbyLayout from '../../components/LobbyLayout';
import AdminTools from '../../components/AdminTools';
import history from "../../src/history";
import {ensureSessionExists,getSessionToken} from "../../core/sessionManager.js";
import LobbyFooter from '../../components/LobbyLayout/LobbyFooter.js';

class AdminPage extends React.Component{
    
  constructor(props){
    super(props);
    this.state = {
      title: pageConfig.title,
      operator:pageConfig.operator,
      operatorLogoUrl:pageConfig.operatorLogoURL,
      isLoggedIn: false,
      isAdmin: false
    };
  }

  componentWillMount() {
    document.title = pageConfig.title;
    if(getSessionToken()) {
        let role = cookie.load('role',{path:'/'});
        if(role === "MASTER_ADMIN"){
            this.setState({isLoggedIn: true, isAdmin:true});
        }else{
            history.push("./lobby");
        }
    } else {
      console.log("Session doesn't exists!");
      history.push("./sign-in");
    }
  }

  render() {
    if(this.state.isLoggedIn && this.state.isAdmin){
      return (
        <LobbyLayout className={s.content}>
            <AdminTools pageAttr={this.state}/>
            <LobbyFooter />
        </LobbyLayout>
      );
    }else{
      return null;
    }
  }
}

export default AdminPage;