import axios from 'axios';
import {normalize} from 'normalizr';

import * as reqUtil from "./util/request-status-util";
import * as actions from "./actionTypes.js";
import * as schema from "../schemas/virtualCompetitorSchema";

import Config from "Config";

export function createVirtualCompetitor(information){
    return function(dispatch){
        dispatch(reqUtil.dispatchNewState(actions.REQ_VIRTUAL_COMPETITOR_API));
        let requestOptions = {
            url: "/competitors/competitor/create",
            method: "POST",
            baseURL: Config.wahooHost,
            headers: {
                "Content-type": "application/json"
            },
            data: {
                name: information.name,
                competitionId: information.virtualCompetitionId
            }
        };

        reqUtil.sendRequest(requestOptions).then((response) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_DATA_VIRTUAL_COMPETITOR_REGISTER,response.data));
        }).catch((error) =>{
            dispatch(reqUtil.dispatchNewState(actions.RECV_ERROR_VIRTUAL_COMPETITOR_REGISTER,error.response || error));
        });
    }
}

export function getVirtualCompetitorsBySubscriber(){
    return function(dispatch){
        dispatch(reqUtil.dispatchNewState(actions.REQ_VIRTUAL_COMPETITOR_API));
        let requestOptions = {
            url: "/competitors/by/subscriber",
            method: "GET",
            baseURL: Config.wahooHost,
            headers: {
                "Content-type": "application/json"
            },
        };

        reqUtil.sendRequest(requestOptions).then((response) => {
            let normlizedData = normalize(response.data.data,schema.virtualCompetitorsSchema);
            normlizedData["success"] = response.data.success;
            dispatch(reqUtil.dispatchNewState(actions.RECV_DATA_VIRTUAL_COMPETITORS,normlizedData));
        }).catch((error) =>{
            console.log("REQUEST ERROR:"+JSON.stringify(error))
            dispatch(reqUtil.dispatchNewState(actions.RECV_ERROR_VIRTUAL_COMPETITORS,error.response || error));
        });
    }

}