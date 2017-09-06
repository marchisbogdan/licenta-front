import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import _ from 'lodash';
import cookie from 'react-cookies';
import { Spinner } from 'react-mdl';
import { FaArrowRight } from 'react-icons/lib/fa';
import { Button, List, ListItem, ListItemContent, Textfield, DataTable, TableHeader} from 'react-mdl';
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
            idOfProductToChange:"",
        };
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
        this.selectionChanged = this.selectionChanged.bind(this);
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

    selectionChanged = (event) => {
        console.log("event:"+JSON.stringify(event));
        console.log("event simple:"+event);
        const id = event.toString().split(",")[0];
        if(id != null){
            this.setState({idOfProductToChange:id });
        }else{
            this.setState({idOfProductToChange:"" });
        }
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

    handleDelete = (event) => {
        event.preventDefault();
        const product = _.find(this.props.productsResponse.data.data,{id:this.state.idOfProductToChange});
        console.log("deleting product with id:"+this.state.idOfProductToChange+" and name:"+product.name);
    }

    handleUpdate = (event) => {
        event.preventDefault();
        const product = _.find(this.props.productsResponse.data.data,{id:this.state.idOfProductToChange});
        console.log("Updating product with id:"+this.state.idOfProductToChange+" and name:"+product.name);
    }

     render() {
        let contentNode = _.map(this.props.productsResponse.data.data, (product) => {
                    let date = new Date(product.bidEndDate).toUTCString();
                    let listItem = {id:product.id,name:product.name,bidEndDate:date,quantity:product.quantity};
                    if(product.highestPrice > 0){
                        listItem.bidedOn = "True";
                    }else{
                        listItem.bidedOn = "False";
                    }
                    return listItem;
                    // return (
                    //     <div id={product.id} key={product.id} className={s.product_container} onClick={this.selectProduct} >
                    //         <div className={s.product_detailes_container}>
                    //             <div className={s.product_image}>
                    //                 <img src={product.imageURL} />
                    //             </div>
                    //             <span><h4 className={s.competition_name}>{product.name}</h4></span>
                    //             <div className={s.competition_detail}>Starting Price: <b>{product.startingPrice}</b></div>
                    //             <div className={s.competition_detail}>Highest Bid: <b>{product.highestPrice}</b></div>
                    //             <div className={s.competition_detail}>Bid End Date: {new Date(product.bidEndDate).toUTCString()}</div>
                    //         </div>
                    //     </div>
                    // );
                })
        return (
            <div className={s.content}>
                <div className={s.pathName}>Admin Tools</div>
                <div className={s.overview}>
                    <div className={s.textField}>
                    <h3>Product Creation</h3>
                    </div>
                    <div className={s.textField}>
                    <Textfield
                        onChange={this.handleNameInputChange}
                        label="Name"
                        floatingLabel
                        error={this.state.nameError}
                        style={{width: '300px'}}
                        value={this.state.idd}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Textfield
                        onChange={this.handleDescriptionInputChange}
                        label="Description"
                        floatingLabel
                        error={this.state.descriptionError}
                        style={{width: '300px'}}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Textfield
                        onChange={this.handleImageURLInputChange}
                        label="ImageURL"
                        floatingLabel
                        error={this.state.imageURLError}
                        style={{width: '300px'}}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Textfield
                        onChange={this.handleBidEndDateInputChange}
                        label="Bid End Date"
                        floatingLabel
                        error={this.state.bidEndDateError}
                        style={{width: '300px'}}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Textfield
                        onChange={this.handleStartingPriceInputChange}
                        label="Starting price"
                        floatingLabel
                        error={this.state.startingPriceError}
                        style={{width: '300px'}}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Textfield
                        onChange={this.handleQuantityInputChange}
                        label="Quantity"
                        floatingLabel
                        error={this.state.quantityError}
                        style={{width: '300px'}}
                    />
                    </div>
                    <div className={s.textField}>                    
                    <Button ripple onClick={this.handleSubmit}>Submit</Button>
                    <Button ripple onClick={this.handleDelete}>Delete</Button>
                    <Button ripple onClick={this.handleUpdate}>Update</Button>
                    </div>
                </div>
                <div className={s.dataCenter}>
                <div className={s.dataCenterAlign}>
                <DataTable
                    selectable
                    shadow={0}
                    rowKeyColumn="id"
                    onSelectionChanged={this.selectionChanged}
                    rows={contentNode}
                >
                    <TableHeader name="name" tooltip="Product name">Name</TableHeader>
                    <TableHeader name="bidEndDate" tooltip="Product bid end date">Bid end date</TableHeader>
                    <TableHeader numeric name="quantity" tooltip="Number of materials">Quantity</TableHeader>
                    <TableHeader name="bidedOn" tooltip="Bids made on product">Bids Made</TableHeader>
                </DataTable>
                </div>
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
