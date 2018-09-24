import axios from "axios";
import {
    UPDATE_STATISTIC,
    UPDATE_STATISTIC_REJECTED
} from "./actionTypes";


export const updateStatistic  = (statisticSearchValue) => async (dispatch) => {
    dispatch({type: UPDATE_STATISTIC,payload: statisticSearchValue});
    try {

    }catch(error){
        dispatch({type:UPDATE_STATISTIC_REJECTED,error:error.data});
        console.warn(error);
    }
};