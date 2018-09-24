import {
    ADD_USER_FULFILLED, DELETE_USER_FULFILLED,
    FILTER_CHANGE, GET_USERS_FULFILLED, REQUEST, REQUEST_REJECTED,
    UPDATE_USER_ROLE_FULFILLED
} from "./actionTypes";
import {openMessageDialog} from "../messageDialog/";
import axios from "axios";

const API_URL = "http://localhost:8080/";
const USERS_PATH = "users/";
const USERS_ENDPOINT = API_URL + USERS_PATH;

export const handleFilterChange = (value) => (dispatch) => dispatch({type:FILTER_CHANGE, payload: value});

export const getUsersAction = async (dispatch) => {
    dispatch({type:REQUEST});

    try{
        const users = await axios.get(USERS_ENDPOINT);
        dispatch({type:GET_USERS_FULFILLED,payload:users.data});
        return users.data;
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

export const updateUserAction = (name, role, id) => async (dispatch) =>{
    dispatch({type:REQUEST,payload:{name, role,id}});
    try{
        const user = await axios.put(USERS_ENDPOINT + id, {name:name,userRole:role} );
        dispatch({type:UPDATE_USER_ROLE_FULFILLED});
        dispatch(getUsersAction);
        return user;
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

export const addUserAction = (name,email,role) => async (dispatch) =>{
    dispatch({type:REQUEST,payload:{name,email,role}});
    try{
        const user = await axios.post(USERS_ENDPOINT, {name,email,userRole:role} );
        dispatch({type:ADD_USER_FULFILLED});
        dispatch(getUsersAction);
        return user;
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

export const deleteUserAction = (id) => async (dispatch) =>{
    dispatch({type:REQUEST,payload:{id}});
    try{
        const user = await axios.delete( USERS_ENDPOINT +  id );
        dispatch({type:DELETE_USER_FULFILLED});
        dispatch(getUsersAction);
        return user;
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

