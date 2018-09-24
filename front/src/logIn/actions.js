import {
    LOG_IN, LOG_IN_FULFILLED, LOG_IN_REJECTED, LOG_OUT, LOG_OUT_FULFILLED, LOG_OUT_REJECTED
} from "./actionTypes";
import {GET_USERS_FULFILLED, REQUEST_REJECTED} from "../adminUsers/actionTypes";
import {openMessageDialog} from "../messageDialog";
import {removeAuthInfo, setAuthInfo} from "../utils/db";

export const logIn = (accessToken) => async (dispatch) => {
    dispatch({type:LOG_IN});

    try{
        //const users = await axios.post();
        dispatch({type:LOG_IN_FULFILLED,payload:accessToken});
        setAuthInfo(accessToken);
        return accessToken;
    }catch(e){
        dispatch({type:LOG_IN_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }

};

export const logOut = async (dispatch) => {
    dispatch({type:LOG_OUT});

    try{
        //const users = await axios.post();
        dispatch({type:LOG_OUT_FULFILLED});
        removeAuthInfo();
    }catch(e){
        dispatch({type:LOG_OUT_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }

};