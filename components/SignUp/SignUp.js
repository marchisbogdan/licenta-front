import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import cx from 'classnames';
import validator from 'validator';
import {connect} from 'react-redux';
import {Textfield,Checkbox,Button} from 'react-mdl';
import _ from "lodash";

import s from './style.css';
import * as apiActions from '../../core/actions/apiActions';
import * as registerActions from '../../core/actions/registerActions';

@connect(state =>({
    signUpResponse: state.register,
    countriesResponse: state.countries
}))

class SignUp extends React.Component{
    
    static propTypes = {
        pageAttr: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            firstNameError: "",
            lastName: "",
            lastNameError: "",
            userName: "",
            userNameError: "",
            email: "",
            emailError: "",
            password: "",
            passwordCheck: "",
            passwordError: "",
            countryId: "",
            countryIdError: "",
            partnerId: "",
            partnerIdError: "",
            birthDate: "",
            birthDateError: "",
            yearDate: "",
            yearDateError: "",
            monthDate: "",
            monthDateError: "",
            dayDate: "",
            dayDateError: "",
            agreedToTermsAndConditions: false,
            agreedToTermAndConditionsError: "",
            role: "",
            roleError: "",
            countries: [],
            modalMessage: "",
            showModal: false
        }
        this.getYearOptions = this.getYearOptions.bind(this);
        this.getMonthOptions = this.getMonthOptions.bind(this);
        this.getDayOptions = this.getDayOptions.bind(this);
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
    }

    componentWillMount() {
        document.title = this.props.pageAttr.title;

    }

    componentDidMount() {
        this.props.dispatch(apiActions.getCountries());
    }

    componentWillReceiveProps(nextProps) {
        // on getCountries()
        if(nextProps.countriesResponse.data){
            if(_.get(nextProps.countriesResponse.data,"success")){
                this.setState({countries:_.sortBy(nextProps.countriesResponse.data.data,['name'])});
            }else{
                console.log("login_request_error:"+_.get(nextProps.countriesResponse.data, "errorMessage"));
                this.setState({modalMessage:"Couldn't retrieve some data, Error:"+nextProps.countriesResponse.data.errorMessage, showModal:true});
            }
        }else if(nextProps.countriesResponse.error){
            console.log("authResponse_error:"+JSON.stringify(nextProps.countriesResponse.error));
            this.setState({modalMessage:nextProps.countriesResponse.error.message, showModal:true});
        }

        // on signUpResponse
        if(nextProps.signUpResponse.data){
            if(_.get(nextProps.signUpResponse.data,"success")){
                this.setState({
                    modalMessage: "The registering process was successful!",
                    showModal: true
                })
            }else{
                this.setState({
                    modalMessage: "Registration Error:"+nextProps.signUpResponse.data.errorMessage, showModal:true
                })
            }
        }else if(nextProps.signUpResponse.error){
            this.setState({
                modalMessage: nextProps.signUpResponse.error.message, showModal:true
            })
        }
    }

    handleModalOnAfterOpen() {
        if(this.state.showModal){
            setTimeout(() => {this.setState({modalMessage: "",showModal:false})},5000);
            this.props.dispatch(registerActions.reset());
        }
    }

    handleModalOnCloseRequest(){
        this.setState({modalMessage: "",showModal:false});
    }

    getYearOptions(){
        let thisYear = new Date().getFullYear();
        let options = [];
        options.push({"value":0,"label":"Select a year..."})
        for(let i=0;i<100;i++){
            let entry = {"value":thisYear-i,"label":thisYear-i};
            options.push(entry);
        }
        return options;
    }

    getMonthOptions(){
        return [{"value":"0","label":"Select a month..."},{"value":"1","label":"January"},{"value":"2","label":"February"},{"value":"3","label":"March"},{"value":"4","label":"April"},{"value":"5","label":"May"},
        {"value":"6","label":"June"},{"value":"7","label":"July"},{"value":"8","label":"August"},{"value":"9","label":"September"},{"value":"10","label":"October"},{"value":"11","label":"November"}
        ,{"value":"12","label":"December"}];
    }

    getDayOptions(){
        let options = [];
        options.push({"value":0,"label":"Select a day..."});
        for(let i=1;i<=31;i++){
            let entry = {"value":i,"label":i};
            options.push(entry);
        }
        return options;
    }

    handleUsernameInputChange = (event) =>{
        this.setState({
            userName: event.target.value,
            userNameError: ""
        })
    }

    handleFirstNameInputChange = (event) => {
        this.setState({
            firstName: event.target.value,
            firstNameError: ""
        })
    }

    handleLastNameInputChange = (event) => {
        this.setState({
            lastName: event.target.value,
            lastNameError: ""
        })
    }

    handleEmailInputChange = (event) => {
        this.setState({
            email: event.target.value,
            emailError: ""
        })
    }

    handlePasswordInputChange = (event) => {
        this.setState({
            password: event.target.value,
            passwordError: ""
        })
    }

    handlePasswordCheckInputChange = (event) => {
        this.setState({
            passwordCheck: event.target.value,
            passwordCheckError: ""
        })
    }

    handleYearInputChange = (event) => {
        this.setState({
            yearDate: event.target.value,
            yearDateError: ""
        })
    }

    handleMonthInputChange = (event) => {
        this.setState({
            monthDate: event.target.value,
            monthDateError: ""
        })
    }

    handleDayInputChange = (event) => {
        this.setState({
            dayDate: event.target.value,
            dayDateError: ""
        })
    }

    handleCountryInputChange = (event) => {
        this.setState({
            countryId: event.target.value,
            countryIdError: ""
        })
    }

    handleAgreedTermsAndConditionsChange = (event) => {
        console.log("old agree:"+this.state.agreedToTermsAndConditions);
        this.setState({
            agreedToTermsAndConditions: !this.state.agreedToTermsAndConditions,
            agreedToTermAndConditionsError: ""
        })
        console.log("new agree:"+this.state.agreedToTermsAndConditions);

    }

    handleSubmit = (event) => {
        event.preventDefault();

        // get the values
        let credentials = {
                userName: this.state.userName.trim(),
                firstName: this.state.firstName.trim(),
                lastName: this.state.lastName.trim(),
                email: this.state.email.trim(),
                password: this.state.password.trim(),
                passwordCheck: this.state.passwordCheck.trim(),
                yearDate: this.state.yearDate,
                monthDate: this.state.monthDate,
                dayDate: this.state.dayDate,
                countryId: this.state.countryId,
                birthDate: "",
                partnerId: this.state.partnerId === "" ? null : this.state.partnerId,
                role: this.state.role === "" ? "USER" : this.state.role,
                agreedToTermsAndConditions: this.state.agreedToTermsAndConditions
        }
        // set error to false
        let error = false;
        
        // check if they are null
        if(!credentials.userName){
            error = true;
            this.setState({
                userNameError: "The username must not be empty!"
            });
        }else if(credentials.userName.length < 5 || credentials.userName.length > 25){
            error = true;
            this.setState({
                userNameError: "The username must have between 5 and 25 characters"
            })
        }
        if(!credentials.firstName){
            error = true;
            this.setState({
                firstNameError: "The first name must not be empty!"
            });
        }
        if(!credentials.lastName){
            error = true;
            this.setState({
                lastNameError: "The last name must not be empty!"
            });
        }
        if(!credentials.email){
            error = true;
            this.setState({
                emailError: "The email must not be empty!"
            });
        }else if(!validator.isEmail(credentials.email)){
            error = true;
            this.setState({
                emailError: "The email must have a valid format!"
            });
        }
        if(!credentials.password){
            error = true;
            this.setState({
                passwordError: "The password must not be empty!"
            })
        }else if(credentials.password.length < 8 || credentials.password.length > 15){
            error = true;
            this.setState({
                passwordError: "The password must have between 8 and 15 characters!"
            });
        }
        if(!credentials.passwordCheck){
            error = true;
            this.setState({
                passwordCheckError: "You must set the password check!"
            });
        }
        if(credentials.password !== credentials.passwordCheck && credentials.passwordCheck && credentials.password){
            error = true;
            this.setState({
                passwordCheckError: "The password must correspond in both fields!"
            });
        }

        if(!credentials.yearDate || credentials.yearDate==="0"){
            error = true;
            this.setState({
                yearDateError: "The year of your birthday must be set!"
            });
        }
        if(!credentials.monthDate || credentials.monthDate==="0"){
            error = true;
            this.setState({
                monthDateError: "The month of your birthday must be set!"
            });
        }
        if(!credentials.dayDate || credentials.dayDate==="0"){
            error = true;
            this.setState({
                dayDateError: "The day of your birthday must be set!"
            })
        }

        if(!credentials.countryId){
            error = true;
            this.setState({
                countryIdError: "You must select your country of provenance!"
            })
        }

        if(!credentials.agreedToTermsAndConditions){
            error = true;
            this.setState({
                agreedToTermAndConditionsError: "You must agree to the terms and conditions before registering!"
            });
        }

        // create the birthDate based on a specific format 'DD-MM-YYYY'
        if(!error){
            let day =  credentials.dayDate.length === 1 ? '0'+credentials.dayDate : credentials.dayDate; 
            let month = credentials.monthDate.length === 1 ? '0'+credentials.monthDate : credentials.monthDate;
            credentials.birthDate = day+"-"+month+"-"+credentials.yearDate; 
        }

        // check if there is an error and return before dispatching an action
        if(error){
            return;
        }

        // dispatch the action
        this.props.dispatch(registerActions.register(credentials));
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
                                onChange={this.handleUsernameInputChange}
                                label="Username"
                                type="text"
                                error={this.state.userNameError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handleFirstNameInputChange}
                                label="Firstname"
                                type="text"
                                error={this.state.firstNameError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handleLastNameInputChange}
                                label="Lastname"
                                type="text"
                                error={this.state.lastNameError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handleEmailInputChange}
                                label="Email"
                                type="email"
                                error={this.state.emailError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handlePasswordInputChange}
                                label="Password"
                                type="password"
                                error={this.state.passwordError}
                                floatingLabel
                            />
                            <Textfield
                                onChange={this.handlePasswordCheckInputChange}
                                label="Password Check"
                                type="password"
                                error={this.state.passwordCheckError}
                                floatingLabel
                            />

                            <div>Select your birth date:</div>
                            <div style={{"display":'block'}}>
                                <div id="yearSelect">
                                    <label>Year: <select className={s.selector} name="yearSelect" onChange={this.handleYearInputChange}>
                                            {this.getYearOptions().map((obj,i) => {
                                                return <option key={obj.value} value={obj.value}>{obj.label}</option>
                                            })}
                                        </select>
                                        <span className={s.errorMessage}>{this.state.yearDateError}</span>
                                    </label>
                                </div>
                                <br/>
                                <div id="monthSelect">
                                    <label>Month: <select className={s.selector} name="monthSelect" onChange={this.handleMonthInputChange}>
                                            {this.getMonthOptions().map((obj,i) => {
                                                return <option key={obj.value} value={obj.value}>{obj.label}</option>
                                            })}
                                        </select>
                                        <span className={s.errorMessage}>{this.state.monthDateError}</span>
                                    </label>
                                </div>
                                <br/>
                                <div id="daySelect">
                                    <label>Day: <select className={s.selector} name="daySelect" onChange={this.handleDayInputChange}>
                                            {this.getDayOptions().map((obj,i) => {
                                                return <option key={obj.value} value={obj.value}>{obj.label}</option>
                                            })}
                                        </select>
                                        <span className={s.errorMessage}>{this.state.dayDateError}</span>
                                    </label>
                                </div>
                            </div>
                            <br/>
                            <div id="countrySelect">
                                <label>Country: <select className={s.selector} name="countrySelect" onChange={this.handleCountryInputChange}>
                                    {this.state.countries.map((obj,i) => {
                                        return <option key={obj.id} value={obj.id}>{obj.name}</option>
                                    })}
                                    </select>
                                    <span className={s.errorMessage}>{this.state.countryIdError}</span>
                                </label>
                            </div>

                            <div className={cx(s.loginOptions,s.centerAlign)}>
                                <div className={cx(s.checkbox)}>
                                    <Checkbox label="I agree to Terms & Conditions" onChange={this.handleAgreedTermsAndConditionsChange} ripple/>
                                </div>
                                <span className={s.errorMessage}>{this.state.agreedToTermAndConditionsError}</span>
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

export default SignUp;