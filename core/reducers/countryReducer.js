import * as actionType from '../actions/actionTypes'

const initialState = {
    data: null,
    error: null,
    isLoading: false,
};

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionType.REQ_DATA_API_COUNTRY:
            return {...state, isLoading:true};
        case actionType.RECV_DATA_API_COUNTRY:
            return {...state, data:action.data, isLoading:false};
        case actionType.RECV_ERROR_API_COUNTRY:
            return {...state, error:action.data, isLoading:false};
        case actionType.RESET_API_COUNTRY:
            return {...state, data:null, error:null, isLoading:false};
        default:
            return state;
    }
}