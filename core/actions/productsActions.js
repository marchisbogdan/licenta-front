import axios from 'axios';

import * as reqUtil from './util/request-status-util';
import * as actions from './actionTypes.js';
import Config from 'Config';

export function getAllProducts() {
  return function (dispatch) {
      dispatch(reqUtil.dispatchNewState(actions.REQ_PRODUCTS));
      const requestOptions = {
          url: '/products/getAllProducts',
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

export function sendComment(content,productId) {
    return function (dispatch) {
        dispatch(reqUtil.dispatchNewState(actions.SEND_COMMENT_CONTENT,null));
        const requestOptions = {
            url: '/products/comment',
            method: 'POST',
            baseURL: Config.localhost,
            headers: {
                'Content-type': 'application/json',
            },
            params: {
                content: content,
                productId: productId,
            }
        }
        reqUtil.sendRequest(requestOptions).then((response) => {
            response.data.productId = productId;
            dispatch(reqUtil.dispatchNewState(actions.RECV_COMMENT_SUCCESS, response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_COMMENT_ERROR, error.response || error));
        });
    }
}

export function deleteProduct(productId){
    return function(dispatch) {
        dispatch(reqUtil.dispatchNewState(actions.REQ_PRODUCT_DELETE));
        const requestOptions = {
            url: 'products/product/id/'+productId,
            method: 'DELETE',
            baseURL: Config.localhost,
            headers: {
                'Content-type': 'application/json',
            }
        }
        reqUtil.sendRequest(requestOptions).then((response) => {
            response.data.productId = productId;
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCT_DELETE_DATA, response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCT_DELETE_ERROR, error.response || error));
        });
    }
}

export function bidOnProduct(productId,bidValue){
    return function(dispatch) {
        dispatch(reqUtil.dispatchNewState(actions.SEND_BID));
        const requestOptions = {
            url: '/products/bid',
            method: 'POST',
            baseURL: Config.localhost,
            headers: {
                'Content-type': 'application/json',
            },
            data: {
                "idProduct": productId,
                "bidValue": bidValue,
            }
        }
        reqUtil.sendRequest(requestOptions).then((response) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_BID_SUCCESS, response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_BID_ERROR, error.response || error));
        });
    }
}

export function resetBids(){
    return function (dispatch) {
         dispatch(reqUtil.dispatchNewState(actions.RESET_BIDS));
    }
}

export function getProductById(productId) {
    return function (dispatch) {
        dispatch(reqUtil.dispatchNewState(actions.REQ_PRODUCTS));
        const requestOptions = {
            url: '/products/product/id/'+productId,
            method: 'GET',
            baseURL: Config.localhost,
            headers: {
                'Content-type': 'application/json',
            }
        }
        reqUtil.sendRequest(requestOptions).then((response) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCT_DATA, response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCTS_ERROR, error.response || error));
        });
    }
}

export function createProduct(productDetails){
    return function (dispatch) {
        dispatch(reqUtil.dispatchNewState(actions.SEND_PRODUCT_CREATION_DATA));
        const requestOptions = {
            url: '/products/product',
            method: 'POST',
            baseURL: Config.localhost,
            headers: {
                'Content-type': 'application/json',
            },
            data: {
                name: productDetails.name,
                description: productDetails.description,
                imageURL: productDetails.imageURL,
                bidEndDate: productDetails.bidEndDate,
                startingPrice: productDetails.startingPrice,
                highestPrice: 0,
                quantity: productDetails.quantity,
            }
        }
        reqUtil.sendRequest(requestOptions).then((response) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCT_CREATION_DATA, response.data));
        }).catch((error) => {
            dispatch(reqUtil.dispatchNewState(actions.RECV_PRODUCT_CREATION_ERROR, error.response || error));
        });
    }
}
