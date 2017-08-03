import * as actionType from "../actions/actionTypes";

const initialState ={
    data: null,
    error: null,
    isLoading: false,
}

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionType.REQ_PWD_RECOVER:
            return {...state,isLoading:true};
        case actionType.RECV_DATA_PWD_RECOVER:
            return {...state, isLoading:false, data:action.data};
        case actionType.RECV_ERROR_PWD_RECOVER:
            return {...state, isLoading:false, error:action.data};
        case actionType.RESET_PWD_RECOVER:
            return {...state, isLoading:false, data: null, error:null};
        default:
            return state;
    }
}