import axios from "axios";

import * as reqUtil from "./util/request-status-util";
import * as types from './actionTypes';
import Config from "Config";

export function getCountries() {
    return function(dispatch) {
        dispatch(reqUtil.dispatchNewState(types.REQ_DATA_API_COUNTRY));

        let requestOption = {
            url: "/references/countries",
            method: "GET",
            baseURL: Config.wahooHost,
            headers: {
                'Content-Type': 'application/json',
                'trusted-username': 'wahoo', // TODO: delete the credentials 
                'trusted-secret': 'wahoo'
            }
        }

        axios(requestOption).then(function(response) {
            dispatch(reqUtil.dispatchNewState(types.RECV_DATA_API_COUNTRY,response.data));
        }).catch(function(error) {
            dispatch(reqUtil.dispatchNewState(types.RECV_ERROR_API_COUNTRY,error.response || error));
        });
    }
}

export function getEventsByRoundId(roundId) {
    return function(dispatch){
        
    }
}