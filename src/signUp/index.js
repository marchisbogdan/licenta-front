import React from 'react';

import s from './style.css';
import pageConfig from '../pageProps.json';
import SignUp from '../../components/SignUp';
import Layout from '../../components/Layout';

class SignUpPage extends React.Component{
    
  constructor(props){
    super(props);
    this.state = {
      title: pageConfig.title,
      operator:pageConfig.operator,
      operatorLogoUrl:pageConfig.operatorLogoURL,
      };
  }

  componentWillMount() {
    document.title = pageConfig.title;
  }

  render() {
      return (
        <Layout className={s.content}>
            <SignUp pageAttr={this.state}/>
        </Layout>
      );
  }
}

export default SignUpPage;