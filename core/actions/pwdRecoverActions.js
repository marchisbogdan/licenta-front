import axios from "axios";

import * as reqUtil from "./util/request-status-util";
import Config from "Config";

export function passwordRecover(email) {
  return function (dispatch){
      dispatch(reqUtil.requestPasswordRecover());

      let requestOption ={
        url: '/subscriber/password-recovery',
        method: 'POST',
        baseURL: Config.wahooSubscriberApi,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email: email
        }
      };

      axios(requestOption).then((response) => {
        dispatch(reqUtil.receiveDataPasswordRecover(response));
      }).catch((error) => {
        dispatch(reqUtil.receiveErrorPasswordRecover(error.response || error))
      });
  }
}

export function reset(){
  return function(dispatch){
    dispatch(reqUtil.resetPasswordRecover());
  }
}