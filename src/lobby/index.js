import React from 'react';

import s from './style.css';
import pageConfig from '../pageProps.json';
import SignUp from '../../components/SignUp';
import LobbyLayout from '../../components/LobbyLayout';
import LobbySegment from '../../components/LobbySegment';
import LobbyFooter from '../../components/LobbyLayout/LobbyFooter.js';
import history from "../../src/history";
import {ensureSessionExists} from "../../core/sessionManager.js";

class Lobby extends React.Component{
    
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
    ensureSessionExists().then( () => {
      this.setState({isLoggedIn: true});
    }).catch( () => {
      history.push("./sign-in");
    })
  }

  render() {
    if(this.state.isLoggedIn){
      return (
        <LobbyLayout className={s.content}>
            <LobbySegment pageAttr={this.state}/>
            <LobbyFooter/>
        </LobbyLayout>
      );
    }else{
      return null;
    }
  }
}

export default Lobby;