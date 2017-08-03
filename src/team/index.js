import React from 'react';

import s from './style.css';
import pageConfig from '../pageProps.json';
import SignUp from '../../components/SignUp';
import LobbyLayout from '../../components/LobbyLayout';
import history from "../../src/history";
import {ensureSessionExists,getSessionToken} from "../../core/sessionManager.js";
import TeamSegment from '../../components/TeamSegment';
import LobbyFooter from '../../components/LobbyLayout/LobbyFooter.js';

class Team extends React.Component{
    
  constructor(props){
    super(props);
    this.state = {
      title: pageConfig.title,
      operator:pageConfig.operator,
      operatorLogoUrl:pageConfig.operatorLogoURL,
      isLoggedIn: false
    };
  }

  componentWillMount() {
    document.title = pageConfig.title;
    if(getSessionToken()){
      this.setState({isLoggedIn: true});
    }else{
      history.push("./sign-in");
    }
    // ensureSessionExists().then( () => {
    //   this.setState({isLoggedIn: true});
    //   console.log('Session exists!');
    // }).catch( () => {
    //   console.log('Session doesn\'t exists!');
    //   history.push("./sign-in");
    // })
  }

  render() {
    if(this.state.isLoggedIn){
      return (
        <LobbyLayout className={s.content}>
            <TeamSegment pageAttr={this.state}/>
            <LobbyFooter/>
        </LobbyLayout>
      );
    }else{
      return null;
    }
  }
}

export default Team;