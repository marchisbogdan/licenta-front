import React from 'react';
import Link from '../Link';
import cx from "classnames";
import s from "./LobbyFooter.css";
import history from "../../src/history";
import {FaArrowLeft, FaListUl, FaTicket, FaGroup, FaCommenting} from "react-icons/lib/fa";

class LobbyFooter extends React.Component {
  constructor(props){
    super(props);
    this.state={
      iconsSize: 24
    }
    this.resizer = this.resizer.bind(this);
    this.goToLastPage = this.goToLastPage.bind(this);
  }

  goToLastPage() {
    history.goBack();
  }

  componentWillMount() {
    window.addEventListener("resize", this.resizer, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize',this.resizer);
  }

  resizer() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    /*let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;*/
    if(parseInt(width) < 768){
      if(this.state.iconsSize !== 24){
        this.setState({iconsSize: 24})
      }
    }else{
      if(this.state.iconsSize !== 32){
        this.setState({iconsSize: 32})
      }
    }
  }
  render(){
    let activeLobby = '', activeEntries = '', activeAdminTools = '', activeNotifications = '';
    console.log('location.pathname:'+JSON.stringify(location));
    location.pathname.includes("/lobby") || location.hash.includes("lobby") ? activeLobby += s.active : false;
    location.pathname.includes("/entries") || location.hash.includes("entries") ? activeEntries += s.active : false;
    location.pathname.includes("/adminTools") || location.hash.includes("adminTools") ? activeAdminTools+= s.active : false;
    location.pathname.includes("/notifications") || location.hash.includes("notifications") ? activeNotifications += s.active : false;

    return (
      <footer className={cx("mdl-mini-footer",s.footer_dim,s.footer)}>
        <div className={cx("mdl-mini-footer__left-section",s.container)}>
          <div className={cx(s.lobbyOptions,s.item)}>
            <Link className={s.link} to="/lobby" onClick={this.goToLastPage}>
              <FaArrowLeft size={this.state.iconsSize}/>
              <div className={s.hide_text}>Back</div>
            </Link>
          </div>
          <div className={cx(s.lobbyOptions,s.item)}>
            <Link className={cx(s.link,activeLobby)} to="/lobby">
              <FaListUl size={this.state.iconsSize}/>
              <div className={s.hide_text}>Lobby</div>
            </Link>
          </div> 
          <div className={cx(s.lobbyOptions,s.item)}>
            <Link className={cx(s.link,activeEntries)} to="/entries">
              <FaTicket size={this.state.iconsSize}/>
              <div className={s.hide_text}>My Entries</div>
            </Link>
          </div> 
          <div className={cx(s.lobbyOptions,s.item)}>
            <Link className={cx(s.link,activeAdminTools)} to="/adminTools">
              <FaGroup size={this.state.iconsSize}/>
              <div className={s.hide_text}>Admin Tools</div>
            </Link>
          </div> 
          <div className={cx(s.lobbyOptions,s.item)}>
            <Link className={cx(s.link,activeNotifications)} to="/lobby">
              <FaCommenting size={this.state.iconsSize}/>
              <div className={s.hide_text}>Notifications</div>
            </Link>
          </div> 
        </div>
      </footer>
    );
  }
}

export default LobbyFooter;
