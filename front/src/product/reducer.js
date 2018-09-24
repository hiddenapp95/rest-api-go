import {
    REQUEST,
} from "./actionTypes";

const initialState = {
    products: [],
    product:{},
    interviewPropertyIndex: 0,
    matchingFilterInterviews: [],
    requesting:false
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case REQUEST: return {...state,requesting:true};
        case GET_PRODUCTS_FULFILLED: return {...state,requesting:false,products:action.payload};
        case UPDATE_PRODUCT_PROPERTY: return {...state,product: {...state.product,[action.payload.key]:action.payload.value}};

    }
}