import {
    OPEN_DIALOG,
    CLOSE_DIALOG
} from "./actionTypes";

const initialState = {
    dialogIsOpen: false,
    message: undefined,
    confirmCallback: undefined,
    cancelCallback: undefined
};

export default function reducer(state=initialState, action){

    switch (action.type){
        case OPEN_DIALOG: {
            const {message,confirmCallback,failureCallback} = action.payload;
            return {dialogIsOpen:true,message:message,confirmCallback:confirmCallback,cancelCallback:failureCallback};
        }
        case CLOSE_DIALOG: return {...initialState,message:state.message};
        default: return state
    }
}