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
        productsResponse: state.products
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
    }

    componentWillMount() {
        // this.props.dispatch(competitorApi.getVirtualCompetitorsBySubscriber());
        console.log("histry:"+history.location);
    }

    componentWillReceiveProps(nextProps) {  
        if(nextProps.virtualCompetitorsResponse){
            if(_.get(nextProps.virtualCompetitorsResponse.creationResponse,"errorMessage")){
                this.setState({showModal:true, modalMessage: _.get(nextProps.virtualCompetitorsResponse.creationResponse,"errorMessage")});
            }
        }else if(nextProps.virtualCompetitionsResponse.error){
            this.setState({showModal:true, modalMessage: nextProps.virtualCompetitionsResponse.error.message})
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

    render() {
        let contentNode;
        if(this.props.productsResponse){
            console.log("In!!");
            if(_.get(this.props.productsResponse.data,"success")){
                //console.log("on success:"+JSON.stringify(this.props.virtualCompetitorsResponse));
                const products = this.props.productsResponse.data.data;
                const { productId } = history.location.state;
                const product = _.find(products, { id: productId });
                console.log("In!! :"+productId+ " prod Id:"+product.id);

                 
                const fun = () => {
                    const comments = _.map(product.comments, (comment) => {
                        const credentials = `${comment.subscriber.userName} - at date: ${new Date(comment.creationDate)}`;
                        console.log("credentials:"+credentials);
                        // <ListItem threeLine key={comment.id}>
                        //     <ListItemContent avatar="person" subtitle="John">hello</ListItemContent>
                        // </ListItem>
                        return (
                            <div key={comment.id} className={s.comment_container}>
                                <div className={s.comment_detailes}>{credentials}</div>
                                <div className={s.comment_detailes}>{comment.content}</div>
                            </div>
                        );
                    });
                    console.log("comments:"+comments[0].content);
                    // console.log("comments:"+comments[0]);
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
                                        <div>Highest Price: {product.highestPrice}</div>
                                        <div>Quantity: {product.quantity}</div>    
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
                                        style={{width: '300px'}}
                                    />
                                    <Button ripple>Post Comment</Button>
                                </div>
                            </div>
                        </div>
                    );
                }
                contentNode = fun();
                console.log("contentNode:"+contentNode);
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