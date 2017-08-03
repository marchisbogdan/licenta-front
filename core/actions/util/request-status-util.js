import * as types from '../actionTypes';
import history from '../../../src/history';
import {getSessionToken,renewToken,evictSession} from '../../../core/sessionManager';
import axios from 'axios';

// For Auth
export function requestDataAuth(){
	return {type: types.REQ_DATA_AUTH};
}

export function receiveDataAuth(json){
	return {
		type: types.RECV_DATA_AUTH,
		data: json
	}
}

export function receiveErrorAuth(json){
	return {
		type:types.RECV_ERROR_AUTH,
		data: json
	}
}

// For Password Recovery
export function requestPasswordRecover(){
    return {type: types.REQ_PWD_RECOVER};
}

export function receiveDataPasswordRecover(json) {
    return {
        type: types.RECV_DATA_PWD_RECOVER,
        data: json
    }
}

export function receiveErrorPasswordRecover(json) {
    return {
        type: types.RECV_ERROR_PWD_RECOVER,
        data: json
    }
}

export function resetPasswordRecover() {
    return {
        type: types.RESET_PWD_RECOVER
    }
}

// For Registration
export function requestDataRegister(){
	return {type: types.REQ_DATA_REGISTER};
}

export function receiveDataRegister(json) {
    return {
        type: types.RECV_DATA_REGISTER,
        data: json
    }
};

export function receiveErrorRegister(json) {
    return {
        type: types.RECV_ERROR_REGISTER,
        data: json
    }
};

export function resetRegister(){
    return {
        type: types.RESET_REGISTER
    }
}

//FOR API
export function resetAuth() {
    return {
        type: types.RESET_AUTH
    }
}

export function dispatchNewState(type, json) {
    return {type, data: json}
};

export function sendRequest(requestOption, dispatch) {
    return new Promise((resolve, reject) => {

        if(!getSessionToken()){
            reject("There is no session token!")
        }else{

            requestOption.headers = requestOption.headers || {}
            requestOption.headers['X-CustomToken'] = getSessionToken()

            axios(requestOption).then((response) => {
                if(response.data.errorMessage === "Invalid token"){
                    console.log("Tying to renewToken!!!"+JSON.stringify(error));
                    renewToken().then(() => {

                            requestOption.headers = requestOption.headers || {}
                            requestOption.headers['X-CustomToken'] = getSessionToken()

                            axios(requestOption).then((response) => {
                                resolve(response)
                            }).catch((error) => {
                                evictSession()
                                reject(error);
                            })
                        }
                    ).catch((error) => {
                        evictSession()
                        console.log("RENEW TOKEN ERROR:"+JSON.stringify(error))
                        reject(error);
                    })
                }else{
                    resolve(response)
                }
            }).catch((error) => {
                // probably because the token has expired.
                //FIXME: need to a way catch this exact issue because if the server is down atm it
                // will try to renew the token if there is one
                console.log("Tying to renewToken!!!"+JSON.stringify(error));

                renewToken().then(() => {

                        requestOption.headers = requestOption.headers || {}
                        requestOption.headers['X-CustomToken'] = getSessionToken()

                        axios(requestOption).then((response) => {
                            resolve(response)
                        }).catch((error) => {
                            evictSession()
                            reject(error);
                        })
                    }
                ).catch((error) => {
                    evictSession()
                    console.log("RENEW TOKEN ERROR:"+JSON.stringify(error))
                    reject(error);
                })
            })
        }
    })
}