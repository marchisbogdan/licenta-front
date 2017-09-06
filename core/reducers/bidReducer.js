import * as actionType from '../actions/actionTypes'

const initialState = {
    data: null,
    error: null,
    isLoading: false,
};

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionType.SEND_BID:
            return {...state, isLoading:true};
        case actionType.RECV_BID_SUCCESS:
            return {...state, data:action.data, isLoading:false};
        case actionType.RECV_BID_ERROR:
            return {...state, error:action.data, isLoading:false};
        case actionType.RESET_BIDS:
            return {...state, data:null, error:null, isLoading:false};
        default:
            return state;
    }
}