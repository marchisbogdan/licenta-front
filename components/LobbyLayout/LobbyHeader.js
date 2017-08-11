import React from 'react';
import MdMenuIcon from 'react-icons/lib/md/menu';
import {IconButton,Menu,MenuItem} from "react-mdl";

import Link from '../Link';
import s from './LobbyHeader.css';
import history from '../../src/history';
import {evictSession} from '../../core/sessionManager';
class LobbyHeader extends React.Component {

  constructor(props){
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    //window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    //window.componentHandler.downgradeElements(this.root);
  }

  signOut(event) {
    event.preventDefault();
    evictSession();
    //history.push("/intro");
  }

  render() {
    return (
        <header className={`mdl-layout__header mdl-layout__header--scroll ${s.header}`}>
          <div className={`mdl-layout__header-row ${s.row}`}>
            <Link className={`mdl-layout-title ${s.title}`} to="/">
              Antique
            </Link>

            <div className="mdl-layout-spacer"></div>

            <nav className="mdl-navigation"> 
              <div style={{position: 'relative'}}>
                <button id="demo-menu-lower-right"
                  className="mdl-button mdl-js-button mdl-button--icon">
                  <MdMenuIcon size={32}/>
                </button>
                <Menu target="demo-menu-lower-right" align="right">
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Options</MenuItem>
                    <MenuItem>Rules</MenuItem>
                    <MenuItem onClick={this.signOut}>Sign out</MenuItem>
                </Menu>
              </div>
            </nav>
          </div>
        </header>
    );
  }
}

export default LobbyHeader;
