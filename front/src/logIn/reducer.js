import {
    LOG_IN, LOG_IN_FULFILLED, LOG_IN_REJECTED, LOG_OUT, LOG_OUT_FULFILLED, LOG_OUT_REJECTED
} from "./actionTypes";


const initialState = {
    user:null,
    login_request: false
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case LOG_IN: return{...state,login_request:true};
        case LOG_IN_FULFILLED: return {...state,login_request:false,user: action.payload};
        case LOG_IN_REJECTED: return {...state,login_request:false};

        case LOG_OUT: return{...state,login_request:true};
        case LOG_OUT_FULFILLED: return {...state,login_request:false,user:null};
        case LOG_OUT_REJECTED: return {...state,login_request:false,user:null};
        default: return state
    }
}