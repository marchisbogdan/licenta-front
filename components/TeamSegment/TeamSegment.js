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
import s from "./TeamSegment.css";
import * as competitorApi from "../../core/actions/competitorApiActions";
import * as playerApi from "../../core/actions/playerActions";

@connect((state) =>(
    {
        virtualCompetitorsResponse: state.virtualCompetitors,
        playersResponse: state.players,
        apiResponse:state.api
    }
))

class TeamSegment extends React.Component {
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
        this.choosePlayer = this.choosePlayer.bind(this);
        this.defencePositions = ['SWEEPER', 'CENTRE_BACK', 'FULL_BACK', 'WING_BACK', 'RIGHT_WING_BACK', 'LEFT_WING_BACK'];
        this.midfieldPositions = ['DEFENSIVE_MIDFIELD', 'CENTRE_MIDFIELD', 'WIDE_MIDFIELD', 'LEFT_WIDE_MIDFIELD', 'RIGHT_WIDE_MIDFIELD','ATTACKING_MIDFIELD'];
        this.attackPositions = ['SECOND_STRIKER', 'WINGER', 'CENTRE_FORWARD', 'LEFT_WINGER', 'RIGHT_WINGER'];
        this.goalkeeperPositions = ['GOALKEEPER'];
    }

    componentWillMount() {
        //this.props.dispatch(competitorApi.getVirtualCompetitorsBySubscriber());
        if(history.location.state){
            let {competitorId,competitionId} = history.location.state;
            if(this.props.virtualCompetitorsResponse){
                if(_.get(this.props.virtualCompetitorsResponse.data,"success")){
                    if(competitorId && competitionId){
                        console.log('competitorId:'+competitorId);
                        console.log('competitionId:'+competitionId);
                        let competitorName = this.props.virtualCompetitorsResponse.data.competitors[competitorId].name;
                        let competitionName = this.props.virtualCompetitorsResponse.data.virtualCompetitions[competitionId].name;
                        let roundsIds = this.props.virtualCompetitorsResponse.data.virtualCompetitions[competitionId].roundsIds;
                        console.log("roundsIds:"+roundsIds);
                        for(let id of roundsIds){
                            console.log('round id:'+id);
                            // GET Rounds
                            
                            // Get players by round
                            this.props.dispatch(playerApi.getPlayersByRoundId(id));
                        }
                        let eventsIds = this.props.virtualCompetitorsResponse.data.virtualCompetitions[competitionId].eventsIds;
                        console.log("eventsIds:"+eventsIds);
                        for(let id of eventsIds){
                            console.log('event id:'+id);
                            // GET ROUNDS
                        }
                    }
                }
            }
        }
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
        // if(this.state.showModal){
        //    this.setState({modalMessage: "",showModal:false});
        // }
    }

    handleModalOnCloseRequest(){
        this.setState({modalMessage: "",showModal:false,filteredPlayers:null});
    }

    goToTeamCreationPage(event){
        event.preventDefault();
        //give a state to this path including the competition id
        let competitorId = event.currentTarget.id;
        let competitionId= this.props.virtualCompetitorsResponse.data.competitors[competitorId].competition;
        history.push({
            pathname: "/team",
            search: '',
            state: {competitionId: competitionId}
        })
    }

    choosePlayer(event){
        // choose the proper position array
        if(event.target.id === event.currentTarget.id){
            return;
        }
        const formationLine = event.currentTarget.id;
        let positions = [];
        if(formationLine === "attack"){
            positions = this.attackPositions;
        }else if(formationLine === "midfield"){
            positions = this.midfieldPositions;
        }else if(formationLine === "defence"){
            positions = this.defencePositions;
        }else{
            positions = this.goalkeeperPositions;
        }

        //filter the players by their line position
        let players =  _.map(this.props.playersResponse.data.players.data, (player) => {
            // check position 
            if(positions.includes(player.position)){
                // create html tags for each player displayed in the modal
                return (
                    // return div with player info and position
                    <div id={player.id} key={player.id} className={s.playerContainer}>
                        <div className={s.playerInfo}>Firstname: {player.firstName}</div>
                        <div className={s.playerInfo}>Lastname: {player.lastName}</div>
                        <div className={s.playerInfo}>Team: {this.props.apiResponse.data.realCompetitors.data[player.competitor].name}</div>
                        <div className={s.playerInfo}>Position: {player.position}</div>
                    </div>
                );
            }
        });
        this.setState({showModal:true, filteredPlayers:players});
    }

    render() {
        let contentNode;
        /*
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
        */
        //console.log('history state:'+JSON.stringify(history.location));
        if(history.location.state){
            let {competitorId,competitionId} = history.location.state;
            if(this.props.virtualCompetitorsResponse){
                if(_.get(this.props.virtualCompetitorsResponse.data,"success")){
                    if(competitorId && competitionId){
                        let competitorName = this.props.virtualCompetitorsResponse.data.competitors[competitorId].name;
                        let competitionName = this.props.virtualCompetitorsResponse.data.virtualCompetitions[competitionId].name;
                        contentNode = <div>Choose a team for the Competitor: <span><h5>{competitorName}</h5></span> of the Competition {competitionName}</div>;
                    }else{
                        contentNode = <div>"No information Provided"</div>;
                    }
                }
            }
        }else{
            console.log('No info');
        }
        return (
            <div className={s.content}>
                <Carousel />
                <div className={s.pathName}>Team Creation</div>
                <div className={s.overview}>
                    {contentNode}
                </div>
                {!this.props.playersResponse.isLoading &&
                    <div className={s.fieldPositions}>
                        <div id="attack" className={s.formationLines} onClick={this.choosePlayer}>
                            <div id="att1" className={s.fieldPosition}>

                            </div>
                            <div id="att2" className={s.fieldPosition}>
                                
                            </div>
                        </div>
                        <div id="midfield" className={s.formationLines} onClick={this.choosePlayer}>
                            <div id="mid1" className={s.fieldPosition}>
                                
                            </div>
                            <div id="mid2" className={s.fieldPosition}>

                            </div>
                            <div id="mid3" className={s.fieldPosition}>
                                
                            </div>
                            <div id="mid4" className={s.fieldPosition}>
                                
                            </div>
                        </div>
                        <div id="defence" className={s.formationLines} onClick={this.choosePlayer}>
                            <div id="def1" className={s.fieldPosition}>
                                
                            </div>
                            <div id="def2" className={s.fieldPosition}>
                                
                            </div>
                            <div id="def3" className={s.fieldPosition}>
                                
                            </div>
                            <div id="def4" className={s.fieldPosition}>
                                
                            </div>
                        </div>
                        <div id="goalkeeper" className={s.formationLines} onClick={this.choosePlayer}>
                            <div id="goalkeeper1" className={s.fieldPosition}>
                                
                            </div>
                        </div>
                    </div>
                }


                <div className={s.spinnerContainer}>
                    {this.props.playersResponse.isLoading && <Spinner singleColor/>}
                </div>
                <Modal
                    isOpen={this.state.showModal}
                    onAfterOpen={this.handleModalOnAfterOpen}
                    onRequestClose={this.handleModalOnCloseRequest}
                    contentLabel="Modal"
                    className={s.informationModal}
                    overlayClassName={s.informationOverlayModal}
                    >
                    <h3>Players Selection</h3>
                    <p>{this.state.modalMessage}</p>
                    <div className={s.playersOverview}>
                        {this.state.filteredPlayers}
                    </div>
                    <div className={cx(s.buttonsContainer,s.bottomPosition)}>
                        <Button raised ripple colored onClick={this.handleModalOnCloseRequest}>Close</Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TeamSegment;