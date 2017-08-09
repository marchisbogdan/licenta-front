import axios from 'axios';

import * as reqUtil from './util/request-status-util';
import * as actions from './actionTypes.js';
import Config from 'Config';

export function getAllProducts() {
  return function (dispatch) {
      dispatch(reqUtil.dispatchNewState(actions.REQ_PRODUCTS));
      const requestOptions = {
          url: '/getAllProducts',
          method: 'GET',
          baseURL: Config.localhost,
          headers: {
              'Content-type': 'application/json',
            },
        };

      reqUtil.sendRequest(requestOptions).then((response) => {
          dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCTS_DATA, response.data));
        }).catch((error) => {
          dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCTS_ERROR, error.response || error));
        });
    };
}