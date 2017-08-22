import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import cookie from 'react-cookies';
import { Spinner } from 'react-mdl';
import { FaArrowRight } from 'react-icons/lib/fa';
import { Button, List, ListItem, ListItemContent, Textfield } from 'react-mdl';
import Modal from 'react-modal';
import validator from 'validator';

import history from '../../src/history';
import Carousel from '../Carousel';
import s from './AdminTools.css';
import * as productActions from '../../core/actions/productsActions.js';

@connect((state) => (
    {
        productsResponse: state.products,
    }
))
class AdminTools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconsSize: 24,
            showModal: false,
            modalMessage: "",
            commentContent: "",
            commentContentError: "",
            name: "",
            nameError: "",
            description: "",
            descriptionError: "",
            imageURL: "",
            imageURLError: "",
            bidEndDate: "",
            bidEndDateError: "",
            startingPrice: "",
            startingPriceError: "",
            quantity: "",
            quantityError: "",

        };
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
        
    }

    componentWillMount() {
        // this.props.dispatch(competitorApi.getVirtualCompetitorsBySubscriber());
    }

    componentWillReceiveProps(nextProps) {  
        // if(nextProps.productsResponse){
        //     if(_.get(nextProps.productsResponse.data,"errorMessage")){
        //         this.setState({showModal:true, modalMessage: _.get(nextProps.productsResponse.data,"errorMessage")});
        //     }
        // }else if(nextProps.virtualCompetitionsResponse.error){
        //     this.setState({showModal:true, modalMessage: nextProps.virtualCompetitionsResponse.error.message})
        // }
    }

    handleModalOnAfterOpen() {
        if(this.state.showModal){
            setTimeout(() => {this.setState({modalMessage: "",showModal:false})},5000);
        }
    }

    handleModalOnCloseRequest(){
        this.setState({modalMessage: "",showModal:false});
    }

    handleNameInputChange = (event) => {
        this.setState({
            name: event.target.value,
            nameError: ""
        })
    }

    handleDescriptionInputChange = (event) => {
        this.setState({
            description: event.target.value,
            descriptionError: ""
        })
    }

    handleImageURLInputChange = (event) => {
        this.setState({
            imageURL: event.target.value,
            imageURLError: ""
        })
    }

    handleBidEndDateInputChange = (event) => {
        this.setState({
            bidEndDate: event.target.value,
            bidEndDateError: ""
        })
    }

    handleStartingPriceInputChange = (event) => {
        this.setState({
            startingPrice: event.target.value,
            startingPriceError: ""
        })
    }

    handleQuantityInputChange = (event) => {
        this.setState({
            quantity: event.target.value,
            quantityError: ""
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let name = this.state.name.trim();
        let description = this.state.description.trim();
        let imageURL = this.state.imageURL.trim();
        let bidEndDate = this.state.bidEndDate.trim();
        let startingPrice = this.state.startingPrice.trim();
        let quantity = this.state.quantity.trim();

        let error = false;

        if(!name) {
            error = true;
            this.setState({
                nameError: "The name field must not be empty!"
            });
        }
        if(!description) {
            error = true;
            this.setState({
                descriptionError: "The description field must not be empty!"
            });
        }
        if(!imageURL) {
            error = true;
            this.setState({
                imageURLError: "The imageURL field must not be empty!"
            });
        }else if(!validator.isURL(imageURL)){
            error = true;
            this.setState({
                imageURLError: "The imageURL field must be a valid URL!"
            });
        }

        if(!bidEndDate) {
            error = true;
            this.setState({
                bidEndDateError: "The bidEndDate field must not be empty!"
            });
        }else if(!validator.isISO8601(bidEndDate)){
            error = true;
            this.setState({
                bidEndDateError: "The bidEndDate field must be a valid Date! example: 2017-08-22T18:12:10+00:00"
            });
        }

        if(!startingPrice) {
            error = true;
            this.setState({
                startingPriceError: "The startingPrice field must not be empty!"
            });
        }else if(!validator.isInt(startingPrice)){
            error = true;
            this.setState({
                startingPriceError: "The startingPrice field must be a valid number!"
            });
        }

        if(!quantity) {
            error = true;
            this.setState({
                quantityError: "The quantity field must not be empty!"
            });
        }else if(!validator.isInt(quantity)){
            error = true;
            this.setState({
                quantityError: "The quantity field must be a valid number!"
            });
        }

        if (error) {
            return;
        }

        let productDetails = {
            name: name,
            description: description,
            imageURL: imageURL,
            bidEndDate: bidEndDate,
            startingPrice: startingPrice,
            quantity: quantity,
        }

        this.props.dispatch(productActions.createProduct(productDetails));
    }

     render() {
        let contentNode = <h1> Admin </h1>
        return (
            <div className={s.content}>
                <Carousel />
                <div className={s.pathName}>Admin Tools</div>
                <div className={s.overview}>
                    {contentNode}
                    <div>Product Creation</div>
                    <Textfield
                        onChange={this.handleNameInputChange}
                        label="Name"
                        error={this.state.nameError}
                        style={{width: '300px'}}
                    />
                    <Textfield
                        onChange={this.handleDescriptionInputChange}
                        label="Description"
                        error={this.state.descriptionError}
                        style={{width: '300px'}}
                    />
                    <Textfield
                        onChange={this.handleImageURLInputChange}
                        label="ImageURL"
                        error={this.state.imageURLError}
                        style={{width: '300px'}}
                    />
                    <Textfield
                        onChange={this.handleBidEndDateInputChange}
                        label="Bid End Date"
                        error={this.state.bidEndDateError}
                        style={{width: '300px'}}
                    />
                    <Textfield
                        onChange={this.handleStartingPriceInputChange}
                        label="Starting price"
                        error={this.state.startingPriceError}
                        style={{width: '300px'}}
                    />
                    <Textfield
                        onChange={this.handleQuantityInputChange}
                        label="Quantity"
                        error={this.state.quantityError}
                        style={{width: '300px'}}
                    />
                    <Button ripple onClick={this.handleSubmit}>Submit</Button>
                </div>
                <div className={s.spinnerContainer}>
                    {this.props.productsResponse.isLoading && <Spinner singleColor/>}
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

export default AdminTools;
