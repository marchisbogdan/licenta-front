import React from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';
import cookie from "react-cookies";
import {Spinner} from "react-mdl";
import {FaArrowRight} from "react-icons/lib/fa";
import {Button} from "react-mdl";
import Modal from "react-modal";
import validator from 'validator';

import Carousel from "../Carousel";
import s from "./LobbySegment.css";
import * as virtualCompetitionsApi from "../../core/actions/virtualCompetitionApiActions";
import * as competitorApi from "../../core/actions/competitorApiActions";
import * as productsApi from "../../core/actions/productsActions";
import * as reqUtil from "../../core/actions/util/request-status-util";
import * as actions from "../../core/actions/actionTypes.js";

@connect((state) =>(
    {
        virtualCompetitionsResponse: state.virtualCompetitions,
        virtualCompetitorsResponse: state.virtualCompetitors,
        productsResponse: state.products
    }
))

class LobbySegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            iconsSize: 24,
            showModal: false,
            modalMessage: "",
        };
        this.joinVirtualCompetition = this.joinVirtualCompetition.bind(this);
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(virtualCompetitionsApi.getVirtualCompetitions());
        this.props.dispatch(productsApi.getAllProducts());
    }

    componentWillReceiveProps(nextProps) {  
        if(nextProps.productsResponse.data){
            if(_.get(nextProps.productsResponse.data,"errorMessage")){
                this.setState({showModal:true,modalMessage: _.get(nextProps.productsResponse.data,"errorMessage")});
            }
        }else if(nextProps.productsResponse.error){
            this.setState({showModal:true, modalMessage: nextProps.productsResponse.error.message});
        }
        // if(nextProps.virtualCompetitorsResponse.creationResponse){
        //     if(_.get(nextProps.virtualCompetitorsResponse.creationResponse,"success")){
        //         let virtualCompetitor = nextProps.virtualCompetitorsResponse.creationResponse.data;
        //         let virtualCompetitorName = virtualCompetitor.name;
        //         let virtualCompetitionName = virtualCompetitor.competition.name;
        //         this.setState({showModal:true,modalMessage: "The competitor: "+virtualCompetitorName+" has been created for the competition: "+virtualCompetitionName})
        //     }else{
        //         this.setState({showModal:true, modalMessage: _.get(nextProps.virtualCompetitorsResponse.creationResponse,"errorMessage")});
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

    componentWillUnmount() {
        this.props.dispatch(reqUtil.dispatchNewState(actions.RESET_VIRTUAL_COMPETITOR_REGISTER));
    }

    joinVirtualCompetition(event){
        event.preventDefault();
        let name = prompt("Choose a name for the Competitor.");
        if(name == null){
            this.setState({showModal:true, modalMessage:"The name must not be empty!"});
            return;
        }
        if(validator.isEmpty(name) || !validator.isAlphanumeric(name)){
            this.setState({showModal:true, modalMessage:"The name must contain only letters and numbers!"});
            return;
        }
        let information = {
            virtualCompetitionId: event.currentTarget.id,
            name: name
        };
        this.props.dispatch(competitorApi.createVirtualCompetitor(information));
    }

    selectProduct(event) {
         
    }

    render() {
        let contentNode;
        if(this.props.productsResponse){
            if(_.get(this.props.productsResponse.data,"success")){
                //console.log("on success:"+JSON.stringify(this.props.virtualCompetitionsResponse));
                contentNode = _.map(this.props.productsResponse.data.data, (product) => {
                    let prize;
                    if(vc.prize.normalPool !== null){
                        prize = "Normal Pool: "+vc.prize.normalPool;
                    }else if(vc.prize.sponsorName !== null){
                        prize = "Sponsor: "+vc.prize.sponsorName;
                    }else{
                        prize = "Prize: Unknown";
                    }
                    return (
                        <div id={product.id} key={product.id} className={<s className="competition_container"></s>} onClick={this.selectProduct} >
                            <span><h4 className={s.competition_name}>{product.name}</h4></span>
                            <div className={s.competitions_detailes_container}>
                                <div className={s.competition_detail}>Starting Price: {product.startingPrice}</div>
                                <div className={s.competition_detail}>Highest Price: {product.highestPrice}</div>
                                <div className={s.competition_detail}>Bid End Date: {new Date(product.bidEndDate).toUTCString()}</div>
                            </div>
                        </div>
                    );
                })
            }
        }
        //console.log("response:"+JSON.stringify(this.props.virtualCompetitionsResponse));/

        return (
            <div className={s.content}>
                <Carousel />
                <div className={s.pathName}>Lobby</div>
                <div className={s.overview}>
                    {contentNode}
                </div>
                <div className={s.spinnerContainer}>
                    {this.props.virtualCompetitionsResponse.isLoading && <Spinner singleColor/>}
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

export default LobbySegment;