import {combineReducers} from "redux";

import auth from "./authReducer";
import register from "./registerReducer";
import pwdRecover from "./pwdRecoverReducer";
import countries from "./countryReducer";
import virtualCompetitions from "./virtualCompetitionsReducer";
import virtualCompetitors from "./virtualCompetitorsReducer";
import players from "./playersReducer";
import api from "./apiReducer";
import products from './productsReducer.js';
import bids from './bidReducer.js';

export default combineReducers({
    api,
    auth,
    register,
    pwdRecover,
    countries,
    players,
    virtualCompetitions,
    virtualCompetitors,
    products,
    bids,
});
