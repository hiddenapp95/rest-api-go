import {
    ADD_INTERVIEW,
    MOVE_TO_NEXT_PROPERTY,
    MOVE_TO_PREVIOUS_PROPERTY,
    UPDATE_PROPERTY,
    REQUEST,
    REQUEST_REJECTED,
    SYNC_INTERVIEWS_FULFILLED,
    DELETE_INTERVIEWS, GET_INTERVIEWS_FULFILLED, SET_INTERVIEW
} from "./actionTypes";
import NAME from "./constants";
import interview,{interviewProperties} from "./model";
import {addInterview, clearInterviews, deleteInterview, deleteInterviews, getInterviews} from "./db";
import {openMessageDialog} from "../messageDialog";
import {getUsersAction} from "../adminUsers/actions";
import axios from "axios";
export const moveToNextInterviewProperty  = (dispatch) => dispatch({type: MOVE_TO_NEXT_PROPERTY});
export const moveToPrevInterviewProperty  = (dispatch) => dispatch({type: MOVE_TO_PREVIOUS_PROPERTY});
export const updateProperty = (name,value) => (dispatch,getStore) => dispatch({type: UPDATE_PROPERTY,payload:{propertyName:interviewProperties[getStore()[NAME].interviewPropertyIndex],name,value}});

export const syncInterviewsAction = async (dispatch,getStore) => {

    const interviews = getInterviews();

    dispatch({type:REQUEST,payload: interviews});
    try{
        const interviews = await axios.post( "http://hwasd.com", interviews );
        dispatch({type:SYNC_INTERVIEWS_FULFILLED});
        clearInterviews();
        return interviews;
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

const getCleanInterview = (newInterview) => {
    try{
        let cleanInterview = {...newInterview};
        for (let i = 0; i<interviewProperties.length; i++) {
            let interviewPropertyValue = interview[interviewProperties[i]].properties;
            let interviewPropertyValueKeys = Object.keys(interviewPropertyValue);
            for (let j = 0; j < interviewPropertyValueKeys.length; j++) {
                if (interviewPropertyValue[interviewPropertyValueKeys[j]].dependsOn && interviewPropertyValue[interviewPropertyValueKeys[j]].toBe !== cleanInterview[interviewProperties[i]][interviewPropertyValue[interviewPropertyValueKeys[j]].dependsOn])
                    delete cleanInterview[interviewProperties[i]][interviewPropertyValueKeys[j]];
            }
        }

        return cleanInterview;
    }catch(e){
        return newInterview
    }
};

export const saveInterviewAction = () => (dispatch,getStore) => {
    try{
        const interview = getStore()[NAME].interview;
        const cleanInterview = getCleanInterview(interview);
        console.log("CLEAN INTERVIEW",cleanInterview);

        dispatch({type: ADD_INTERVIEW,payload: cleanInterview});
        addInterview(cleanInterview);
    }catch(e){
        //dispatch(openMessageDialog(e));
        throw e
    }
};


// export const getInterviewsAction = () => (dispatch) => {
//     try{
//         dispatch({type: GET_INTERVIEWS});
//         return getInterviews();
//     }catch(e){
//         dispatch(openMessageDialog(e));
//     }
// };

export const deleteInterviewAction = (index) => async(dispatch,getStore) => {
    try{
        dispatch({type: DELETE_INTERVIEWS});
        return await deleteInterview(index);
    }catch(e){
        dispatch(openMessageDialog(e));
    }
};

export const deleteAllInterviewsAction = async(dispatch,getStore) => {
    try{
        dispatch({type: DELETE_INTERVIEWS});
        return await clearInterviews();
    }catch(e){
        dispatch(openMessageDialog(e));
    }
};

export const getInterviewsAction = (prop,value) => dispatch => {
    dispatch({type:REQUEST});

    try{
        //const interviews = await axios.get( {...user,role:role} );
        dispatch({type:GET_INTERVIEWS_FULFILLED, payload:[{
                interviewDetails:{},
                personalData:{},
                requirements:{},
                evaluationRole:{},
                maxInstructionLevel:{},
                studies:{},
                trainingWillInsideConstruction:{},
                trainingWillOutsideConstruction:{},
                recordsProperties: {},
                workingExperienceProperties: {},
                certification: {},
                interviewDecision: {}
            }]});
        return "OK";
    }catch(e){
        dispatch({type:REQUEST_REJECTED,error:e});
        dispatch(openMessageDialog(e));
    }
};

export const setInterview = (interview) => (dispatch) => dispatch({type:SET_INTERVIEW,payload:interview});