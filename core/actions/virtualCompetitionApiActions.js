import axios from "axios";

import * as reqUtil from "./util/request-status-util";
import * as actions from "./actionTypes.js";
import Config from "Config";

export function getVirtualCompetitions(){
    return function(dispatch){
        dispatch(reqUtil.dispatchNewState(actions.REQ_DATA_VIRTUAL_COMPETITIONS));
        let requestOptions = {
            url: '/virtual-competition',
            method: 'GET',
            baseURL: Config.wahooHost,
            headers: {
                'Content-type': 'application/json'
            }
        }

        reqUtil.sendRequest(requestOptions).then((response) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_DATA_VIRTUAL_COMPETITIONS,response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_ERROR_VIRTUAL_COMPETITIONS, error.response || error));
        })
    }
}