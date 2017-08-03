import React from "react";
import PropTypes from "prop-types";
import s from "./Login.css";
import cx from "classnames";
import history from "../../src/history";
import Modal from 'react-modal';
import validator from "validator";
import * as authActions from '../../core/actions/authActions';
import {connect} from 'react-redux';
import _ from 'lodash';
import {createNewSession, ensureSessionExists} from "../../core/sessionManager";
import Link from "../../components/Link";
import cookie from "react-cookies";
import {
    Checkbox,Textfield,Button,Snackbar
} from "react-mdl";

@connect(state => (
    {
        authResponse: state.auth
    }
))

class Login extends React.Component {

    static propTypes = {
        pageAttr: PropTypes.object.isRequired,
     };

    constructor(props) {
        super(props);
        this.state = {
            emailOrUsername: "",
            emailOrUsernameError: "",
            password: "",
            passwordError: "",
            rememberMe: false,
            modalMessage: "",
            showModal: false
        };
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleUsernameOrEmailInputChange = this.handleUsernameOrEmailInputChange.bind(this);
        //this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
    }

    componentWillMount() {
        document.title = this.props.pageAttr.title;
/*        cookie.remove('jwtToken');
        cookie.remove('renewTokenId');
        cookie.remove('username');
        cookie.remove('role');*/
    }

    componentDidMount() {
    }

    componentWillReceiveProps(prop) {
        if(prop.authResponse.data){
            if(_.get(prop.authResponse.data,"success")){
                createNewSession(prop.authResponse.data.data,this.state.rememberMe)
                    .then(() => {
                        history.push("./lobby");
                    }).catch((err) => {
                        console.log("create_new_session_error:"+err);
                        //alert(err);
                    });
            }else{
                this.setState({modalMessage:_.get(prop.authResponse.data, "errorMessage"), showModal:true});
            }
        }else if(prop.authResponse.error){
            this.setState({modalMessage:prop.authResponse.error.message,showModal:true});
        }

    }

    handleUsernameOrEmailInputChange = (event) => {
        this.setState({
            emailOrUsername: event.target.value,
            emailOrUsernameError: ""
        })
    }

    handlePasswordInputChange = (event) => {
        this.setState({
            password: event.target.value,
            passwordError: ""
        })
    }

    handleRememberMeChange = (event) => {
        this.setState({
            rememberMe: !this.state.rememberMe
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let emailOrUsername = this.state.emailOrUsername.trim();
        let password = this.state.password.trim();

        let error = false;
        if(!emailOrUsername){
            error = true;
            this.setState({
                emailOrUsernameError: "The email or username field must not be empty!"
            });
        }else{
            let emailErr = false;
            let usernameErr = false;
            if(!validator.isEmail(emailOrUsername)){
                emailErr = true;
            }
            if(!validator.isAlphanumeric(emailOrUsername)){
                usernameErr = true;
            }
            if(emailErr && usernameErr){
                this.setState({
                    emailOrUsernameError: "The email or username is not valid!"
                });
            }
        }

        if(!password){
            error = true;
            this.setState({
                passwordError: "The password field must not be empty!"
            });
        }
        if (error) {
            console.log(this.state.emailOrUsernameError);
            console.log(this.state.passwordError);
            return;
        }

        this.props.dispatch(authActions.authUser(emailOrUsername, password));
    }

    handleModalOnAfterOpen() {
        if(this.state.showModal){
            setTimeout(() => {this.setState({modalMessage: "",showModal:false})},5000);
            this.props.dispatch(authActions.reset());
        }
    }

    handleModalOnCloseRequest(){
        this.setState({modalMessage: "",showModal:false});
    }

    render() {

        return (
            <div className={s.content}>
                <h2 className={cx(s.centerAlign)}>{this.props.pageAttr.operator}</h2>
                <div className={s.mainLogo}>
                    <img className={s.logoImg} src={this.props.pageAttr.operatorLogoURL}/>
                </div>
                <br/>
                <div className={cx(s.loginOverlays,s.centerAlign)}> 
                    <div className={cx(s.inputs,s.centerAlign)}>
                        <form onSubmit={this.handleSubmit}>
                            <Textfield
                                onChange={this.handleUsernameOrEmailInputChange}
                                label="Email or Username"
                                type="text"
                                error={this.state.emailOrUsernameError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handlePasswordInputChange}
                                label="Password"
                                type="password"
                                error={this.state.passwordError}
                                floatingLabel
                            />

                            <div className={cx(s.loginOptions,s.centerAlign)}>
                                <div className={cx(s.checkbox)}>
                                    <Checkbox label="Remember Me" onChange={this.handleRememberMeChange} ripple/>
                                </div>
                                <div className={cx(s.link)}>
                                    <Link className="mdl-navigation__link" to="/password-recovery">Forgot Password</Link>
                                </div>
                            </div>

                            <div className={cx(s.buttonsContainer,s.centerAlign)}>
                                <Button raised ripple colored>Sign in</Button>
                            </div>
                        </form>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    onAfterOpen={this.handleModalOnAfterOpen}
                    onRequestClose={this.handleModalOnCloseRequest}
                    contentLabel="Modal"
                    className={s.informationModal}
                    overlayClassName={s.informationOverlayModal}

                    >
                    <h3>Message</h3>
                    <p>{this.state.modalMessage}</p>
                    <div className={cx(s.buttonsContainer,s.bottomPosition)}>
                        <Button raised ripple colored onClick={this.handleModalOnCloseRequest}>Close</Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Login;