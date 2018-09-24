import {
    UPDATE_GROWTH_FULFILLED,
    UPDATE_RECORDS_INFO_FULFILLED
} from "./actionTypes";

const initialState = {
    recordInfo:[],
    growth:null
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case UPDATE_GROWTH_FULFILLED: return {...state,growth:action.payload};
        case UPDATE_RECORDS_INFO_FULFILLED: return {...state,recordInfo:action.payload};
        default: return state
    }
}