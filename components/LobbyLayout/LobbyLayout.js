import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import LobbyHeader from './LobbyHeader';
import LobbyFooter from './LobbyFooter';
import s from './LobbyLayout.css';

class LobbyLayout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props){
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="mdl-layout mdl-js-layout" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container">
          <LobbyHeader />
          <main className="mdl-layout__content">
            <div {...this.props} className={cx(s.content, this.props.className)} />
          </main>
        </div>
      </div>
    );
  }
}

export default LobbyLayout;