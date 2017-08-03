import * as actionTypes from "../actions/actionTypes";

const initialState = {
    data: {
        subscribers: null,
        virtualCompetitions: null,
        competitors: null,
        competitorsIds: [],
        lastUpdated: 0,
        success: false,
    },
    creationResponse: null,
    error: null,
    isLoading: false
}

export default function reducer(state = initialState, action){
    switch (action.type) {
        case actionTypes.REQ_VIRTUAL_COMPETITOR_API:
            return {...state, isLoading:true};

        case actionTypes.RECV_DATA_VIRTUAL_COMPETITOR_REGISTER:
            return {...state, creationResponse: action.data, isLoading:false};

        case actionTypes.RECV_DATA_VIRTUAL_COMPETITORS:
            let data = {
                subscribers: action.data.entities.subscribers,
                virtualCompetitions: action.data.entities.virtualCompetitions,
                competitors: action.data.entities.competitors,
                competitorsIds: action.data.result,
                lastUpdated: new Date(),
                success: action.data.success
            }

            return {...state, data: data, isLoading:false};

        case actionTypes.RECV_ERROR_VIRTUAL_COMPETITOR_REGISTER:
            return {...state, error: action.data, isLoading:false};

        case actionTypes.RECV_ERROR_VIRTUAL_COMPETITORS:
            return {...state, error: action.data, isLoading: false};

        case actionTypes.RESET_VIRTUAL_COMPETITOR_REGISTER:
            return {...state, creationResponse: null, error: null, isLoading: false};
            
        case actionTypes.RESET_VIRTUAL_COMPETITOR_DATA:
            return {...state, data: null, error:null, isLoading:false};
        default:
            return state;
    }
}