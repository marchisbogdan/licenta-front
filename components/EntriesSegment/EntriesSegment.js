import React from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';
import cookie from "react-cookies";
import {Spinner} from "react-mdl";
import {FaArrowRight} from "react-icons/lib/fa";
import {Button, List, ListItem, ListItemContent, Textfield } from "react-mdl";
import Modal from "react-modal";
import validator from 'validator';

import history from "../../src/history";
import Carousel from "../Carousel";
import s from "./EntriesSegment.css";
import * as productsApi from "../../core/actions/productsActions";

@connect((state) =>(
    {
        productsResponse: state.products,
        bidsResponse: state.bids,
    }
))

class EntriesSegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iconsSize: 24,
            showModal: false,
            modalMessage: "",
            commentContent: "",
            commentContentError: "",
        };
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.bidOnProduct = this.bidOnProduct.bind(this);
    }

    componentWillMount() {
        // this.props.dispatch(competitorApi.getVirtualCompetitorsBySubscriber());
    }

    componentWillReceiveProps(nextProps) {  
        if(nextProps.productsResponse){
            if(_.get(nextProps.productsResponse.data,"errorMessage")){
                this.setState({showModal:true, modalMessage: _.get(nextProps.productsResponse.data,"errorMessage")});
            }
        }
        if(nextProps.bidsResponse){
            if(_.get(nextProps.bidsResponse.data,"errorMessage")){
                this.setState({showModal:true, modalMessage: _.get(nextProps.bidsResponse.data,"errorMessage")});
            }else{
                if(_.get(nextProps.bidsResponse.data, "success")){
                    this.setState({showModal:true, modalMessage: "Bid has been set!"});
                    this.props.dispatch(productsApi.resetBids());
                    this.props.dispatch(productsApi.getAllProducts());
                }
            }
        }
    }

    handleModalOnAfterOpen() {
        if(this.state.showModal){
            setTimeout(() => {this.setState({modalMessage: "",showModal:false})},5000);
        }
    }

    handleModalOnCloseRequest(){
        this.setState({modalMessage: "",showModal:false});
    }

    handleCommentChange = (event) => {
        this.setState({
            commentContent: event.target.value,
            commentContentError: ""
        });
    }

    sendComment = (event) => {
        event.preventDefault();
        let content = this.state.commentContent.trim();
        let error = false;
        content = validator.escape(content);
        if(!content) {
            error = true;
            this.setState({
                commentContentError: "The comment content is empty!",
            })
        }

        if(error){
            return;
        }

        const { productId } = history.location.state;
        this.props.dispatch(productsApi.sendComment(content, productId));
    }

    bidOnProduct = (event) => {
        event.preventDefault();
        const { productId } = history.location.state;
        const bidValue = prompt("Bid a sum of money for the selected product.");
        console.log("Bid value:"+bidValue);
        if(validator.isDecimal(bidValue)){
             const product = _.find(this.props.productsResponse.data.data, { id: productId });
             if(product.highestPrice >= bidValue) {
                 this.setState({modalMessage: "The bid value must be larger then the highest price.",showModal:true});
             }else{
                 this.props.dispatch(productsApi.bidOnProduct(productId,bidValue));
             }
        }else{
            this.setState({modalMessage: "The value you have inserted is not a valid number.",showModal:true});
        }
    }

    render() {
        let contentNode;
        if(this.props.productsResponse){
            if(_.get(this.props.productsResponse.data,"success")){
                //console.log("on success:"+JSON.stringify(this.props.virtualCompetitorsResponse));
                const products = this.props.productsResponse.data.data;
                const { productId } = history.location.state;
                const product = _.find(products, { id: productId });

                const fun = () => {
                    const comments = _.map(product.comments, (comment) => {
                        const credentials = `${comment.subscriber.userName} - at date: ${new Date(comment.creationDate)}`;
                        return (
                            <div key={comment.id} className={s.comment_container}>
                                <div className={s.comment_detailes}>{credentials}</div>
                                <div className={s.comment_detailes}>{comment.content}</div>
                            </div>
                        );
                    });
                    return (
                        <div id={product.id} key={product.id} className={s.product_container}>
                            <div className={s.product_detailes_container}>
                                <div className={s.mega_container}>
                                    <img src={product.imageURL} />
                                </div>
                                <div className={s.mega_container}>
                                    <div className={s.details}>
                                        <h4>Product: {product.name}</h4>
                                        <div>Starting Price: {product.startingPrice}</div>
                                        <div>Highest Bid: {product.highestPrice}</div>
                                        <div>Quantity: {product.quantity}</div>    
                                        <br/>
                                        <Button raised ripple colored onClick={this.bidOnProduct}>Bid</Button>
                                    </div>
                                </div>
                            </div>
                            <div className={s.product_description}>
                                <h5>Description</h5>
                                <br/>
                                <div>{product.description}</div>
                            </div>
                            <div className={s.comments_section}>
                                {comments}
                                <div>
                                    <Textfield
                                        onChange={this.handleCommentChange}
                                        label="Comment content..."
                                        rows={3}
                                        error={this.state.commentContentError}
                                        style={{width: '300px'}}
                                    />
                                    <Button raised ripple onClick={this.sendComment}>Post Comment</Button>
                                </div>
                            </div>
                        </div>
                    );
                }
                contentNode = fun();
            }else{
                return (
                    <div className={s.spinnerContainer}>
                        <Spinner singleColor/>
                    </div>
                );
            }
        }else{
            console.log("didn't get a response!");
        }

        return (
            <div className={s.content}>
                <Carousel />
                <div className={s.pathName}>My Entries</div>
                <div className={s.overview}>
                    {contentNode}
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

export default EntriesSegment;