
import {ADD_USER_FULFILLED, FILTER_CHANGE, GET_USERS_FULFILLED, REQUEST, REQUEST_REJECTED,UPDATE_USER_ROLE_FULFILLED} from "./actionTypes";

const initialState = {
    users:[],
    filter: "",

    requestInProgress: false
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case FILTER_CHANGE: return {...state,filter:action.payload};

        case REQUEST: return{...state,requestInProgress:true};
        case REQUEST_REJECTED: return{...state,requestInProgress:false};
        case UPDATE_USER_ROLE_FULFILLED: return{...state,requestInProgress:false};
        case ADD_USER_FULFILLED: return{...state,requestInProgress:false};
        case GET_USERS_FULFILLED: return{...state,requestInProgress:false,users:action.payload};
        default: return state
    }
}