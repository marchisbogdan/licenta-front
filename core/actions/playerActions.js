import axios from "axios";
import {normalize} from 'normalizr';

import * as reqUtil from "./util/request-status-util";
import * as actions from "./actionTypes";
import Config from "Config";
import * as schema from "../schemas/playerSchema";

export function getPlayersByRoundId(roundId){
    return function(dispatch){
        dispatch(reqUtil.dispatchNewState(actions.REQ_DATA_PLAYERS));

        let requestOption = {
            url: "/players/by/round/id/"+roundId,
            method: "GET",
            baseURL: Config.wahooHost,
            headers: {
                "Content-Type":"application/json"
            }
        }
        reqUtil.sendRequest(requestOption).then(function(response) {
            //console.log('response:'+JSON.stringify(response));
            let normalizedData = normalize(response.data.data,schema.playersSchema);
            normalizedData["success"] = response.data.success;
            dispatch(reqUtil.dispatchNewState(actions.RECV_DATA_PLAYERS,normalizedData));
            dispatch(reqUtil.dispatchNewState(actions.RECV_DATA_REAL_COMPETITORS,normalizedData));
        }).catch(function(error) {
            console.log("REQUEST ERROR:"+JSON.stringify(error))
            dispatch(reqUtil.dispatchNewState(actions.RECV_ERROR_PLAYERS,error || error));
        });
    }
}