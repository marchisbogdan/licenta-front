import axios from "axios";

import * as reqUtil from "./util/request-status-util";
import Config from "Config";

export function authUser(username, password) {
  return function (dispatch) {

    // BEGIN - Request instantiation
    dispatch(reqUtil.requestDataAuth());

    let requestOption = {
      url: '/auth/subscriber/login',
      method: 'POST',
      baseURL: Config.wahooSubscriberApi,
      headers: {
        'Content-Type': 'application/json'
      },  
      data: {
        emailOrUsername: username,
        password: password
      },
    };

    axios(requestOption).then(function (response) {
      dispatch(reqUtil.receiveDataAuth(response.data));
    }).catch(function (error) {
      dispatch(reqUtil.receiveErrorAuth(error.response || error));
      //dispatch(pushState(null, '/error'));
      
    });
  }
}

export function reset() {
  return function (dispatch) {
    dispatch(reqUtil.resetAuth())
  }
}