import React from 'react';
import s from './style.css';
import cx from 'classnames';
import Button from '../../components/Button';
import Layout from '../../components/Layout';
import pageConfig from "../pageProps.json";

class IntroPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      operator:pageConfig.operator,
      operatorLogoUrl:pageConfig.operatorLogoURL
    };
    let mainTitle = "Fantasy Sports";
  }

  componentWillMount() {
    document.title = pageConfig.title;
  }

  componentDidMount() {
    setTimeout( () => {this.stopLoading(this.state)},10000);
  }

  stopLoading(lastState){
    this.setState({...lastState,isLoading:false});
  }

  // change the buttons href attribute for different environment test cases:
  // dev: sign-up
  // production: /api-docs/ui#/sign-in
  render() {
    return(
        <Layout className={s.content}>
          <h2 className ={s.headings}>{this.state.operator}</h2>
          <div className={s.mainLogo}>
            <img className={s.logoImg} src={this.state.operatorLogoUrl}/>
          </div>
          <br/>
          <br/>
          <div className={s.buttonsContainer}>
            <Button href="/api-docs/ui#/sign-up" colored ripple>Sign up</Button>
            <Button href="/api-docs/ui#/sign-in">Sign in</Button>
          </div>
        </Layout>
      )
  }
}

export default IntroPage;