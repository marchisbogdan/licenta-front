import axios from "axios";

import * as reqUtil from "./util/request-status-util";
import Config from "Config";

export function register(credentials) {
    return function(dispatch){
        dispatch(reqUtil.requestDataRegister());

        let requestOption = {
            url: "/auth/subscriber/register",
            method: "POST",
            baseURL: Config.wahooSubscriberApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data:{
                firstName:credentials.firstName,
                lastName:credentials.lastName,
                userName:credentials.userName,
                email:credentials.email,
                password:credentials.password,
                countryId:credentials.countryId,
                partnerId:credentials.partnerId,
                birthDate:credentials.birthDate,
                agreedToTermsAndConditions:credentials.agreedToTermsAndConditions,
                role: credentials.role
            }
        }
        axios(requestOption).then((response) => {
            dispatch(reqUtil.receiveDataRegister(response.data));
        }).catch((error) => {
            dispatch(reqUtil.receiveErrorRegister(error.response || error));
        })
    }
}

export function reset(){
    return function(dispatch){
        dispatch(reqUtil.resetRegister());
    }
}