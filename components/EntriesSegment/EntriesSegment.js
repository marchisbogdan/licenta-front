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

import history from "../../src/history";
import Carousel from "../Carousel";
import s from "./EntriesSegment.css";
import * as competitorApi from "../../core/actions/competitorApiActions";

@connect((state) =>(
    {
        virtualCompetitorsResponse: state.virtualCompetitors
    }
))

class EntriesSegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaded: false,
            iconsSize: 24,
            showModal: false,
            modalMessage: "",
        };
        this.goToTeamCreationPage = this.goToTeamCreationPage.bind(this);
        this.handleModalOnAfterOpen = this.handleModalOnAfterOpen.bind(this);
        this.handleModalOnCloseRequest = this.handleModalOnCloseRequest.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(competitorApi.getVirtualCompetitorsBySubscriber());
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

    goToTeamCreationPage(event){
        event.preventDefault();
        //give a state to this path including the competition id
        let competitorId = event.currentTarget.id;
        let competitionId= this.props.virtualCompetitorsResponse.data.competitors[competitorId].competition;
        history.push({
            pathname: "/team",
            search: '',
            state: {
                competitionId: competitionId,
                competitorId: competitorId
            }
        });
    }

    render() {
        let contentNode;
        if(this.props.virtualCompetitorsResponse){
            if(_.get(this.props.virtualCompetitorsResponse.data,"success")){
                //console.log("on success:"+JSON.stringify(this.props.virtualCompetitorsResponse));
                let competitions = this.props.virtualCompetitorsResponse.data.virtualCompetitions;
                contentNode = _.map(this.props.virtualCompetitorsResponse.data.competitors, (competitor) => {
                    let prize;
                    let {competition} = competitor;
                    let virtualCompetition = competitions[competition];

                    if(virtualCompetition.prize.normalPool !== null){
                        prize = "Normal Pool: "+virtualCompetition.prize.normalPool;
                    }else if(virtualCompetition.prize.sponsorName !== null){
                        prize = "Sponsor: "+virtualCompetition.competition.sponsorName;
                    }else{
                        prize = "Prize: Unknown";
                    }
                    return (
                        <div id={competitor.id} key={competitor.id} className={s.competition_container} onClick={this.goToTeamCreationPage}>
                            <div className={s.competitions_detailes_container}>
                                <div className={s.competition_detail}><h5 className={s.competition_name}>Competitor: {competitor.name}</h5></div>
                                <div className={s.competition_detail}><h5 className={s.competition_name}>Competition: {virtualCompetition.name}</h5></div>
                            </div>
                            <div className={s.competitions_detailes_container}>
                                <div className={s.competition_detail}>Secondary Name: {virtualCompetition.secondaryName}</div>
                                <div className={s.competition_detail}>Launch Date: {new Date(virtualCompetition.launchDateTime).toUTCString()}</div>
                                <div className={s.competition_detail}>Max Number of Entrants: {virtualCompetition.maxNumParticipants}</div>
                                <div className={s.competition_detail}>{prize}</div>
                            </div>
                        </div>
                    );
                })
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
                    {this.props.virtualCompetitorsResponse.isLoading && <Spinner singleColor/>}
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