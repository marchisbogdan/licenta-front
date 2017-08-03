import * as actionType from '../actions/actionTypes';

const initialState = {
    data: {
        events: {
            data: null,
            eventsIds: [],
            lastUpdated: 0,
            success: false,
        },
        rounds: {
            data: null,
            roundsIds: [],
            lastUpdated: 0,
            success: false,
        },
        seasons: {
            data: null,
            seasonsIds: [],
            lastUpdated: 0,
            success: false,
        },
        eventCompetitor: {
            data: null,
            eventCompetitorsIds: [],
            lastUpdated: 0,
            success: false,
        },
        realCompetitors: {
            data: null,
            realCompetitorsIds: [],
            lastUpdated: 0,
            success: false,
        },
    },
    error: null,
    isLoading: false,
};


function realCompetitorsReducer(state = initialState.data.realCompetitors, action){
    switch (action.type) {
        case actionType.RECV_DATA_REAL_COMPETITORS:
            return {...state, data: action.data.entities.realCompetitors,
                lastUpdated: new Date(),
                success: true};
        default:
            return state;
    }
}

export default function reducer(state = initialState, action){
    switch (actionType) {
        case actionType.REQ_DATA_API:
            return {...state, isLoading: true};
        case actionType.RECV_ERROR_API:
            return {...state, isLoading:false, error: action.data};
        default:
            return {
                data: {
                    realCompetitors: realCompetitorsReducer(state.realCompetitors,action)
                },
                error: null,
                isLoading: false,
            }
    }
}