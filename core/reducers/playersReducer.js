import * as actionType from '../actions/actionTypes';

const initialState = {
    data: {
        players: {
            data: null,
            playersIds: [],
            lastUpdated: 0,
            success: false,
        }
    },
    error: null,
    isLoading: false,
};

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionType.REQ_DATA_PLAYERS:
            return {...state, isLoading:true};

        case actionType.RECV_DATA_PLAYERS:
            let players = {
                data: action.data.entities.players,
                playersIds: action.data.result,
                lastUpdated: new Date(),
                success:action.data.success,
            }
            let data = {
                players:players
            }
                
            return {...state, data:data, isLoading:false, error:null};

        case actionType.RECV_ERROR_PLAYERS:
            return {...state, error:action.data, isLoading:false};

        case actionType.RESET_PLAYERS:
            return {...state, data:null, error:null, isLoading:false};

        default:
            return state;
    }
}