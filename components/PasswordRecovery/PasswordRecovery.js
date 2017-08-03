import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import cx from 'classnames';
import validator from 'validator';
import {connect} from 'react-redux';
import _ from 'lodash';
import {
    Textfield,Button
} from "react-mdl";

import s from "./style.css";
import history from "../../src/history";
import * as pwdRecoverActions from "../../core/actions/pwdRecoverActions";

@connect((state) =>(
        {
            pwdRecoverResponse: state.pwdRecover
        }
    )
)

class PasswordRecovery extends React.Component{

    static propTypes = {
        pageAttr: PropTypes.object.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            email: "",
            emailError: "",
            modalMessage: "",
            showModal: false
        }
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
    }


    componentWillMount() {
        document.title = this.props.pageAttr.title;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pwdRecoverResponse.data){
            if(_.get(nextProps.pwdRecoverResponse.data.data,"success")){
                this.setState({modalMessage:"Email was sent!",showModal:true});
            }else{
                console.log("login_request_error"+_.get(nextProps.pwdRecoverResponse.data, "errorMessage"));
                this.setState({modalMessage:nextProps.pwdRecoverResponse.data, showModal:true});
            }
        }else if(nextProps.pwdRecoverResponse.error){
            console.log("authResponse_error"+JSON.stringify(nextProps.pwdRecoverResponse.error));
            this.setState({modalMessage:nextProps.pwdRecoverResponse.error.message, showModal:true});
        }
    }

    handleEmailInputChange = (event) => {
        this.setState({
            email:event.target.value,
            emailError: ""
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let email = this.state.email.trim();

        let error = false;
        if(!email){
            error = true;
            this.setState({emailError:"The email must not be empty!"});
        }else{
            if(!validator.isEmail(email)){
                error=true;
                this.setState({emailError:"The email must be valid!"});
            }
        }

        if(error){
            return;
        }

        this.props.dispatch(pwdRecoverActions.passwordRecover(email));

    }

    handleModalOnAfterOpen() {
        if(this.state.showModal){
            setTimeout(() => {this.setState({modalMessage: "",showModal:false})},5000);
            this.props.dispatch(pwdRecoverActions.reset());
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
                            onChange={this.handleEmailInputChange}
                            label="Email"
                            type="email"
                            error={this.state.emailError}
                            floatingLabel
                        />
                        <div className={cx(s.buttonsContainer,s.centerAlign)}>
                            <Button raised ripple colored onClick={() => {history.push('./sign-in')}}>Back</Button>
                            <Button raised ripple colored>Send Email</Button>
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
                <h3>Content</h3>
                <p>{this.state.modalMessage}</p>
                <div className={cx(s.buttonsContainer,s.bottomPosition)}>
                    <Button raised ripple colored onClick={this.handleModalOnCloseRequest}>Close</Button>
                </div>
            </Modal>
            
        </div>
        );
    }
}

export default PasswordRecovery;