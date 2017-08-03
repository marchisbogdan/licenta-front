import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import s from './style.css';
import Login from '../../components/Login';
import Layout from '../../components/Layout';
import * as operatorCredentials from '../intro/index.md';
import pageProps from "../pageProps.json";
import history from "../../src/history";
import {ensureSessionExists, getSessionToken} from "../../core/sessionManager";

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: pageProps.title,
            operator: pageProps.operator,
            operatorLogoURL: pageProps.operatorLogoURL,
            render: false
        };
    }

    componentWillMount() {
        document.title = this.state.title;

        ensureSessionExists().then(() =>{
            this.setState({render:false});
            history.push("./lobby");
        }).catch(() =>{
            this.setState({render:true})
        });
    }

    render() {
        if(this.state.render){
            return (
                <Layout className={s.content}>
                    <Login pageAttr={this.state}/>
                </Layout>
            );  
        }else{
            return null;
        }
    }
}

export default SignIn;