import React from 'react';

import s from './style.css';
import pageProps from "../pageProps.json";
import PasswordRecovery from '../../components/PasswordRecovery';
import Layout from '../../components/Layout';

class PasswordRecoveryPage extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {title: pageProps.title,
            operator: pageProps.operator,
            operatorLogoURL: pageProps.operatorLogoURL
        };
    }

    componentWillMount() {
        document.title = this.state.title;
    }

    render() {
        return (
            <Layout className={s.content}>
                <PasswordRecovery pageAttr={this.state}/>
            </Layout>
        );
    }
}

export default PasswordRecoveryPage;