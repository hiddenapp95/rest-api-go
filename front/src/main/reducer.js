import {WEB_APP_ONLINE} from "./actionTypes";

const initialState = {
    online: false
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case WEB_APP_ONLINE: return {online: action.payload};
        default: return state
    }
}