import {OPEN_DIALOG, CLOSE_DIALOG} from "./actionTypes";

export const openMessageDialog = (message,confirmCallback,cancelCallback) =>
    (dispatch) => dispatch({type: OPEN_DIALOG,payload:{message,confirmCallback,cancelCallback} });

export const closeMessageDialog = (dispatch) => dispatch({type: CLOSE_DIALOG});